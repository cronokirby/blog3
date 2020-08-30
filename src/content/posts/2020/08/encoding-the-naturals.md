---
title: "Encoding the Naturals"
date: 2020-08-30
draft: false
description: "Exploring 3 different ways of encoding the natural numbers"
path: "/posts/2020/08/encoding-the-naturals"
type: post
image: "/posts/2020/08/encoding-the-naturals/cover.jpg"
tags:
  - Math
  - Category Theory
  - Haskell
---

In this post, we'll cover 3 ways I know of encoding the natural numbers $\mathbb{N}$ in
your standard functional language with recursive types and polymorphism. At least, these are the
3 most generalized ways of doing it. As we'll see, some common encodings are just specific cases
of a more general encoding.

# Prerequisites

Some familiarity with defining data types in a functional-esque language might be helpful,
but shouldn't be strictly necessary. Understanding recursive data types and polymorphism
is helpful as well. I use a bit of category theory (natural transformations)
at one point, but you can just skim over that if the concept is alien to you.

# $\mathbb{N}$, recursively

The natural numbers, mathematically, are the standard set of "counting numbers" we're familiar with from
preschool:

$$\{0, 1, 2, 3, 4, 5, \ldots\}$$

This is an infinite set, going on forever, starting from the number $0$.
The mathematical definition isn't the concern of this post, but it can be interesting to think
about how we might introduce the natural numbers into a system of mathematics. The main problem
there is whether or not we need to basically accept the natural numbers as some axiomatic
object that exists, or whether we can define it through some more fundamental construct.

In a programming language, we can translate finite sets of objects into a type pretty
straightforwardly. For example, set $\mathbb{B} = \{T, F\}$ of booleans can easily be encoded as a *sum type* in Haskell:

```haskell
data Bool = T | F
```

An element `x` of type `Bool` is either `T :: Bool`, or `F :: Bool`. Those are the only two ways to
*construct* a `Bool`.

We can map the same process to recreate any *finite* set in Haskell. Each element of
the set becomes a constructor of the data type. Of course, there are sometimes better ways
of doing this. For example, the cartesian product $\mathbb{B} \times \mathbb{B}$, concretely is:

$$\{(F, F), (F, T), (T, F), (T, T)\}$$

Which, using the same translation, gives us:

```haskell
data BxB = FF | FT | TF | TT
```

We could reuse the bool type we defined previously, and get the much less redundant:

```haskell
data BxB = Both Bool Bool
```

Then `Both T F, Both F T, ...` would serve as our elements.

Anyways, the problem with $\mathbb{N}$ is that it is *infinite*. If we try to define something like:

```haskell
data Nat = Zero | One | Two | ...
```

we can't actually finish the process. Unfortunately (or inevitably), Haskell is not able
to understand what we mean by `...` in this context. If we managed to do things this way,
then our datatype definition would have an "infinite" amount of information, but to construct
a `Nat`, you would only need a "finite" amount of information, the constructor to use.
We want to reverse this, to have a finite specification of `Nat`, allowing for "infinitely large"
combinations of the constructors.

