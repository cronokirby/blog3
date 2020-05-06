---
title: "Parsing A Whitespace-Sensitive Language"
date: 2020-05-07
draft: true
description: "How to parse a language taking whitespace into account, with a functional language as an example"
path: "/posts/parsing-a-whitespace-sensitive-language"
image: "/posts/parsing-a-whitespace-sensitive-language/cover.jpg"
type: post
tags:
  - "Parsing"
  - "Programming Languages"
---

This post is about how to parse programming languages which define blocks using indentation,
instead of braces and semicolons. We'll end up learning how to infer these blocks based on the indentation,
using [Typescript](https://www.typescriptlang.org/) to parse a toy functional language.

## Background Knowledge

This post stops at generating tokens we can feed into a parser. Implementing a parser
doesn't change because of whitespace sensitivity (at least, not with the technique
we'll be seeing). If you want to explore how to do parsing, [this chapter](https://www.craftinginterpreters.com/parsing-expressions.html)
of [Crafting Interpreters](https://www.craftinginterpreters.com) is very good.

The chapter on lexing from the same book might be useful to look at if you want to understand
lexing as well. We will be going over how that works here though.

Familiarity with Typescript will help in reading the code, but shouldn't be necessary
to understand what's going on.

There's no need to understand Haskell, or functional languages. We will be parsing a very small
subset of a Haskell-like language, and referencing some of the syntax of Haskell, but
nothing beyond that.

With that said, let's get on to the meat of this post.

# The Language

Here's an example program in the language we'll be working with in this post:

```
f = x => x * x

y =
  let
    z = 4
  in z + f z x = x * x

y =
  let
    z = 4
  in z + f z
```

We have the usual arithmetic operators: `+`, `-`, `*`, and `/`. Function application doesn't require parentheses,
so `f x` means `f(x)` in more standard notation. We define functions with `arg => expression` syntax.
Programs are just a sequence of definitions `name = expression`. One new aspect that might be unfamiliar
is the `let ... in` construct. This is what we'll call a "let expression", and is what
is sensitive to whitespace.

What the let expression allows us to do is define intermediate values that we use in another
expression. We can also nest multiple let expressions:

```
let
  z =
    let
      x = 2
      y = 3
    in x + y
in z
```

The way we tell which definitions belong to which block is through the indentation. The
definitions inside of the same let block all have the same indentation, which lets us
tell that they belong there.

# Parsing

Parsing is about going from the text / source code of our program, and getting to
a representation of the program that we can use for things like iinterpreting, compiling,
or manipulating the program in other programmatic ways.

This representation usually takes the form of a [Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree).
For example, if we take the first program we took as an example, we have:

```
f = x => x * x

y =
  let
    z = 4
  in z + f z
```

After parsing, we end up with a tree like structure representing the program:

![](/posts/parsing-a-whitespace-sensitive-language/1.png)

We start with the top level definitions, with one branch for each of them. Then we
have a node for the definition / `=` construct, with a branch for the name, and a
branch for the expression.

The expression breaks down into a subtree, whose subexpressions also have trees, etc.

This tree like structure is much more ready for manipulation than a string of characters is.
It's much easier to use a tree of arithmetic operations to implement a calculator than it is to try and
and interpret the stream of characters as they arrive.

## Parsing as stages

Without going into the details too much, parsing usually works by using a set of rules
(called a *Grammar*) which tell us how to combine certain strings into a small part of our
tree.

For example, we might define expressions like:

```
expr := expr + expr | expr - expr | expr * expr | expr / expr | number
```

This says that an expression is formed by adding one of `+`, `-`, `*`, or `/` between
two expressions, or simply having a number. This would give us:

```
1+1+3-4

1*3-4
```

As valid expressions according to these rules.

Now there are a few problems with defining arithmetic expressions this way, but we
don't really care about that in this post. We just need to know that parsing involves
defining these kinds of rules.

Here we defined parsing rules as operating strictly on characters. So:

```
1 + 2
```

Wouldn't technically be valid, because the two whitespace characters ` ` aren't accounted
for in the rules. Having to add extra rules to handle things like allowing spacing things
on the same line, or ignoring comments would get very annoying, and make our grammar
more complicated.

### Tokenizing

One solution to this problem is instead of feeding each character to our parser, we
instead feed it larger blocks of meaningful "words". Defining a grammar in terms
of "words" instead of individual characters makes sense in the analogy with human
language as well. We usually call these "words" **Tokens** or **Lexemes**.

Going back to the same example program:

```
f = x => x * x

y =
  let
    z = 4
  in z + f z
```

One way to tokenize this would be:

```
f
=
x
=>
x
*
x
y
=
let
z
=
4
in
z
+
f
z
```

Notice that some concepts become a single token, such as `=>` or `let` this means that
our grammar can refer to these directly, instead of worrying about each character. We also
ignore all whitespace and comments when outputting tokens, which makes the grammar's work
much simpler as well.

# What's hard about whitespace

To us humans, it doesn't seem hard to understand what

```
let
  x = f
  y = f
in x + y
```

means. It's difficult for us to *not* notice the indentation structure, and align
things together. Visually, we basically see:

![](/posts/parsing-a-whitespace-sensitive-language/2.png)

without even thinking about it. A parser might not see this so easily without making it
aware of indentation. If we look at the token stream, we have:

```
let x = f y = f in x + y
```

The problem might start to appear at this stage. You see, what about that `f y` in the
middle? What stops our parser from seeing that as the function `f` applied to the argument
`y`? After it does that, it will run into the `=` and not understand what to do, but
by then it's too late. The problem is that our tokenizer outputs a stream of tokens that
ignores all whitespace, so we've removed the visual cues that tells us when certain expressions
end.

Our goal is to find a way to output this information in a way that makes the parser's
job easy.

# An easier language

Languages like C and Typescript have braces to denote blocks, instead of indentation. C
even requires explicit semicolons between statements, instead of relying on newlines to tell it when a new statement
begins. Typescript will try and infer semicolons for you. This is a hint towards what we might
try to do later.

For now let's remove all whitespace sensitivity from our language, and actually write a lexer
for it.

The very first program we saw now becomes:

```
{
f = x => x * x;

y =
  let {
    z = 4
  } in z + f z
}
```

A bit ugly (in my view), but it explicitly marks when statements end, and what the
block structure looks like. Because of the semicolons, there's no issue with parsing

```
x = f;
y = 2
```
as `x = f y; = 2`, since we put the semicolon at the right place.

With the language being defined, let's actually write a lexer!

It's time to put on our programming socks and write some code in an actual language
(Typescript) instead of a made up one :)

## Tokens

We need a type to represent the different tokens our lexer will output. Thankfully
Typescript comes equipped has [enums](https://www.typescriptlang.org/docs/handbook/enums.html)
which fit the bill perfectly.

```ts
enum TokenType {
  // =
  Equal,
  // +
  Plus,
  // {
  LeftBrace,
  // }
  RightBrace,
  // ;
  SemiColon,
  // Keywords
  Let,
  In,
  // These will need data attached
  Number,
  Name,
}
```

This enumerates the different types of tokens we'll be outputting. For most of the tokens,
just knowing the type is knowing everything we need to. For the last two, we also want
to know what exactly the token contains, to distinguish `Number(1)` from `Number(2)`.

Our full token structure will thus be:

```ts
interface Token {
  readonly type: TokenType;
  readonly data?: string;
}
```

For the last two types of token, we'll make sure to include `data` along with the type,
so our parser can have that information as well.
