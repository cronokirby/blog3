---
title: "Lambda Calculus in Lambda Calculus"
date: 2020-04-04
description: "How little it takes to get this little language interpreting itself"
draft: false
path: "/posts/lambda-calculus-in-lambda-calculus"
type: post
image: "/posts/lambda-calculus-in-lambda-calculus/cover.jpg"
tags:
  - "Programming"
  - "Frontend"
  - "Backend"
  - "Javascript"
  - "GraphQL"
---

So, now that we're decided on using De Bruijin indices to represent the calculus,
we need to make this representation and the reduction algorithm a bit more concrete.

The first thing we need to do is represent the calculus in some kind of programming
language. The best fit for this is a pseudo-functional language. This language
doesn't actually exist, but we can use it to sketch out the details of our
reduction algorithm. We'll just be using it to eventually translate it back
into the calculus, so we don't need to be picky about formal semantics.

With that said, let's jump into the description of the calculus:

```
type Index := Int

type Expr := Name Index
           | Lambda Expr
           | Apply Expr Expr
```

So, we represent De Bruijin indices with (positive) integers. For representing
the expressions in our calculus, we create an expression for each type of term:

  - `Name 0` corresponds to a reference to an index, like `0`
  - `Lambda _` corresponds to an abstraction arround an expression, like `λ _`
  - `Apply e1 e2` corresponds to function application, like `e1 e2`

And with that, we can represent any expression in the calculus using this constructors.

For example, the following expression:

```
λλ 0 1
```

will be represented as:

```
Lambda (Lambda (Apply (Name 0) (Name 1)))
```

Now, we need to figure out how to reduce things. So we need to define a function:

```
reduce : Expr -> Expr
```

We can define it recursively, like this:

```
reduce (Apply (Lambda e1) e2) =
  reduce (subs 1 (reduce e2) e1)
reduce (Lambda e1) = Lambda (reduce e1)
reduce (Apply e1 e2) = Apply (reduce e1) (reduce e2)
reduce other = other
```

For the other two lines, we just recurse inside the structure to reduce as much as
we can. The key here is the first line.

If we have something like:

```
λ(λλ2)((λ1)1)
```

Then we want to first reduce the argument as much as we can, and then we want to insert
that argument throughout the body of the first function. We can then reduce the final
result after this substitution. To do this, we need a way to
replace an index based name with some argument.

One naive way to implement substitution would be as follows:

```
subs i new (Name n) = if i == n then new else Name n
subs i new (Lambda e) = Lambda (subs i new e)
subs i new (Apply e1 e2) = Apply (subs i new e1) (subs i new e2)
```

There are a few problems that we need to fix here.

The first comes from when substituting into an expression like:

```
λλ1 2
``` 

The `1` here refers to the *second* `λ` and not the first. So the result of

```
subs 1 X (λλ1 2)
```

should be:

```
λλ1 X
```

In order to accomplish this, we need to make sure to increment the index we're searching
for when we encounter a `λ`:

```
subs i new (Lambda e) = Lambda (subs (i + 1) new e)
```

So that takes care of the first problem, but there's still another issue hiding here.

Let's say we have the following expression:

```
λ(λ 1)1
```

When we want to evaluate the function application, we start by substituting the index `1`
with the expression `1`, and get:

```
λ(λ 1)
```

The problem is that this isn't correct, since it refers to the *second* lambda, instead
of the *first* as it did previously. To fix this problem, we need to introduce
the **lifting** operation.

The idea behind this operation `lift n k` is to increase the index of all terms `>= k`
by `n`. Like with substitution, this operation should be relative to the start of
the expression, and take into account the change in indices required when seeing `λ` terms.

The operation is defined as follows:

```
lift n k (Name i) = if i < k then Name i else Name (i + n)
lift n k (Lambda e) = Lambda (lift n (k + 1) e)
lift n k (Apply e1 e2) = Apply (lift n k e1) (lift n k e2)
```

For simple names, this does what it says on the sticker. And it takes into account
the introduction of `λ` terms by lifting the threshold up.

We can now use this new operation to fix the problem we had earlier:

```
subs i new (Name n) =
  if i == k then lift (n - 1) 0 new else Name n 
```

If we put the entire algorithm in full, we have:

```
lift : Index -> Index -> Expr -> Expr
lift n k (Name i) = if i < k then Name i else Name (i + n)
lift n k (Lambda e) = Lambda (lift n (k + 1) e)
lift n k (Apply e1 e2) = Apply (lift n k e1) (lift n k e2)

subs : Index -> Expr -> Expr -> Expr
subs i new (Name n) =
  if i == k then lift (n - 1) 0 new else Name n
subs i new (Lambda e) = Lambda (subs (i + 1) new e)
subs i new (Apply e1 e2) = Apply (subs i new e1) (subs i new e2)

reduce : Expr -> Expr
reduce (Apply (Lambda e1) e2) =
  reduce (subs 1 (reduce e2) e1)
reduce (Lambda e1) = Lambda (reduce e1)
reduce (Apply e1 e2) = Apply (reduce e1) (reduce e2)
reduce other = other
```

Now, if you didn't entirely get it, that's fine. The point of all this is not
to understand the evaluation algorithm fully. We just need to have *some* algorithm
that we know works, and that we can translate into the calculus itself.

So now we have the reduction algorithm down in this pseudo code, we need to start
translating each of the components into the calculus itself. We already know how
to do functions in lambda calculus, but how do we do integers, or the expression
sum type?

Well, we're going to have to use *church encoding*. Basically, we need to encode both
of these things as functions! Since we only have functions, we're going to have to use
these to encode our types as well.

To encode booleans, we use a standard technique for representing sum types.

If we have a type:

```
T := A A1 A2 | B B1 B2
```

The idea is that in order to make a function `T -> x` for some `x` we need to provide
a way to handle each branch of `T`. We need to be able to handle an `A` and its arguments,
as well as a `B` and its arguments.

So a function `T -> x` is in a way equivalent to `((A1, A2) -> x, (B1, B2) -> x)`.

Now, if I have a `T` I can also construct a function `(T -> x) -> x`:

```
f : T -> ((T -> x) -> x)
f t = λr.r t
```

But we can also go the other way:

```
f' : ((T -> x) -> x) -> T
f' reduce = reduce (λt.t)
```

Since the reducer works for any type `T`, we can also pass it a function that just returns
its argument, and get back a `T`.

This means that `T` is equivalent to `(T -> x) -> x`. We can combine this with the previous
fact we derived about `(T -> x)`. To get that `T` is equivalent to the following:

```
((A1, A2) -> x, (B1, B2) -> x) -> x
```

Or if we curry everything:

```
(A1 -> A2 -> x) -> (B1 -> B2 -> x) -> x
```

For example, `A a1 a2` becomes:

```
λa1.λa2.λonA.λonB.onA a1 a2
```

So, if we apply this blindly to booleans, we get:

```
true := λonT.λonF.onT
false := λonT.λonF.onF
```

To encode integers, we use a technique called church numerals. The idea is that we represent
the natural number `N` as a term that takes in a function and an argument, and applies
the function `N` times to its argument. So the first numerals are:

```
0: λf.λx.x
1: λf.λx.f x
2: λf.λx.f (f x)
...
```

You get the picture. We could have also used the sum type encoding, but doing it this
way is a bit simpler.

In terms of the functions we use on natural numbers, we're going to need an operation
for `i - 1` and a way to compare 