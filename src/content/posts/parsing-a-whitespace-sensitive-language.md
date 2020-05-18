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
  Equal = '=',
  Plus = '+',
  LeftBrace = '{',
  RightBrace = '}',
  SemiColon = ';',
  // Keywords
  Let = 'let',
  In = 'in',
  // These will need data attached
  Number = 'Number',
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

## Lexer

Now let's actually write a lexer for this simple language. Our goal, once again, will
be to take in our input string, and start spitting out tokens. Our focus here will
be to make this concrete, through an actual function.

What is a "stream" anyways? How do we represent this in Typescript? One choice would be
to have a function like this

```ts
function lex(input: string): Token[]
```

One thing I don't like about this is that we have to explicitly construct the entire
list of tokens. This can be inefficient in later stages, since we're keeping the entire
token stream in memory, instead of "streaming" them one by one.

### Generators

[Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)
are a better way of providing a "stream" of data from a function.

Here's a simple generator returning integers:

```ts
function* numbers() {
  for (let i = 0; i < 100; ++i) {
    yield i;
  }
}
```

Instead of just returning a single value, we can instead yield many values. This function
will yield all the integers up to 100. We can consume this generator like this:

```ts
for (const n of numbers()) {
  console.log(n);
}
``` 

And we'll end up printing all the numbers that this generator yields.

### Back to lexing

Let's create a Lexer class that will contain the state we need when lexing, along
with a few different methods.

```ts
class Lexer {
  private i: number;

  constructor(private readonly input: string) {
    this.i = 0;
  }

  peek() {
    if (this.i >= this.input.length) {
      return null;
    }
    return this.input[this.i];
  }

  advance() {
    this.i++;
  }
}
```

The `peek` method returns the current character, if available, and the `advance` method
allows us to move on to further characters.
We'll be able to write the lexer by combining these two methods.

The next method we'll write is:

```ts
*[Symbol.iterator]() {
  yield { type: Token.Equal };
}
```

This allows us to write things like:

```ts
for (const token of new Lexer('a + b')) {
}
```

### Simple Tokens

The one character operators are very easy to lex:

```ts
*[Symbol.iterator]() {
  for (let peek = this.peek(); peek !== null; peek = this.peek()) {
    switch (peek) {
      case '=':
        self.advance();
        yield { type: Token.Equal };
        break;
      case '+':
        self.advance();
        yield { type: Token.Plus };
        break;
      case '{':
        self.advance();
        yield { type: Token.LeftBrace };
        break;
      case '}':
        self.advance();
        yield { type: Token.RightBrace };
        break;
      case ';':
        self.advance();
        yield { type: Token.SemiColon };
        break;
  }
}
```

We look at the next character, and as long as it's valid, we look at which single operator
it matches, accept the character by advancing, and then yield the corresponding token.
Everything is simple, because we only need to see one character to match it with a token,
so far.

Let's add support for numbers now:

```ts
*[Symbol.iterator]() {
  for (let peek = this.peek(); peek !== null; peek = this.peek()) {
    switch (peek) {
      case '=':
        // Single tokens ...
      default:
        if (isNumber(peek)) {
          const data = self.number();
          yield { type: Token.Number, data }
        }
        break;
  }
}

number() {
  let acc = '';
  for (
    let peek = this.peek();
    peek !== null && isNumber(peek);
    peek = this.peek()
  ) {
    acc += peek;
    this.advance();
  }
  return acc;
}

function isNumber(char: string): boolean {
  return /[0-9]/.test(char);
}
```

After matching all the single tokens, we then need to check whether or not the character
is numeric. If it is, then delegate to the `number` method. The `number` method keeps
feeding numeric characters into a big string, and returns once it sees a non-numeric
character. It *doesn't* consume that character, so it's available for parsing.

### Keywords / Names

We'll be doing names similarly to numbers:

```ts
*[Symbol.iterator]() {
  for (let peek = this.peek(); peek !== null; peek = this.peek()) {
    switch (peek) {
    case '=':
      // Single tokens ...
    default:
      if (isNumber(peek)) {
        const data = this.number();
        yield { type: TokenType.Number, data }
      } else if (isLowerAlpha(peek)) {
        const data = this.string();
        yield { type: TokenType.Name, data }
      }
      break;
  }
}

string() {
  let acc = '';
  for (
    let peek = this.peek();
    peek !== null && isLowerAlpha(peek);
    peek = this.peek()
  ) {
    acc += peek;
    this.advance();
  }
  return acc;
}

function isLowerAlpha(char: string): boolean {
  return /[a-z]/.test(char)
}
```

We have the same thing as we do for numbers, except that we're accepting `abc...` instead
of `012..`. For the sake of simplicity, I haven't included the full character range. In
practice you'd want to tweak this code slightly so that things like:

```
a22
aA3
snake_case
```

are also allowed by the function.

The only tokens we have left are `let` and `in`. One problem we didn't have previously
is that these tokens are currently recognized, but as names:

```ts
{ type: TokenType.Name, data: 'let' }
{ type: TokenType.Name, data: 'in' }
```

We just need to check that the name we've just parsed doesn't correspond to one
of the keywords, in which case we return the specialized token:

```ts
const data = this.string();
if (data === 'let') {
  yield { type: TokenType.Let };
} else if (data === 'in') {
  yield { type: TokenType.In };
} else {
  yield { type: TokenType.Name, data };
}
```

Finally, let's throw an error if we don't recognize a character, instead of just stalling:

```ts
*[Symbol.iterator]() {
  for (let peek = this.peek(); peek !== null; peek = this.peek()) {
    switch (peek) {
      default:
        if (isNumber(peek)) {
          // handling number
        } else if (isLowerAlpha(peek)) {
          // handling strings
        } else {
          throw new Error(`Unrecognized character: '${peek}'`);
        }
        break;
    }
  }
}
```

### Skipping Whitespace

We can lex `a+3`, but we can't lex `a + 3` yet. This is because we're not handling
any of the whitespace characters yet. We just need to add another case to our
matching:

```ts
function isWhitespace(char: string): boolean {
  return /[\n\r\s]/.char(string);
}

*[Symbol.iterator]() {
  for (let peek = this.peek(); peek !== null; peek = this.peek()) {
    switch (peek) {
      case '=':
      // Single tokens...
      default:
        if (isWhitespace(char)) {
          this.advance();
        } else if // ...
        break;
    }
  }
}
```

At this point, we have a complete lexer:

```ts
function isNumber(char: string): boolean {
  return /[0-9]/.test(char);
}

function isLowerAlpha(char: string): boolean {
  return /[a-z]/.test(char)
}

function isWhitespace(char: string): boolean {
  return /[\n\r\s]/.test(char);
}

class Lexer {
  private i: number;

  constructor(private readonly input: string) {
    this.i = 0;
  }

  peek() {
    if (this.i >= this.input.length) {
      return null;
    }
    return this.input[this.i];
  }

  advance() {
    this.i++;
  }

  *[Symbol.iterator]() {
    for (let peek = this.peek(); peek !== null; peek = this.peek()) {
      switch (peek) {
        case '=':
          this.advance();
          yield { type: TokenType.Equal };
          break;
        case '+':
          this.advance();
          yield { type: TokenType.Plus };
          break;
        case '{':
          this.advance();
          yield { type: TokenType.LeftBrace };
          break;
        case '}':
          this.advance();
          yield { type: TokenType.RightBrace };
          break;
        case ';':
          this.advance();
          yield { type: TokenType.SemiColon };
          break;
        default:
          if (isNumber(peek)) {
            const data = this.number();
            yield { type: TokenType.Number, data };
          } else if (isLowerAlpha(peek)) {
            const data = this.string();
            if (data === 'let') {
              yield { type: TokenType.Let };
            } else if (data === 'in') {
              yield { type: TokenType.In };
            } else {
              yield { type: TokenType.Name, data };
            }
          } else {
            throw new Error(`Unrecognized character: '${peek}'`);
          }
          break;
      }
    }
  }

  number() {
    let acc = '';
    for (
      let peek = this.peek();
      peek !== null && isNumber(peek);
      peek = this.peek()
    ) {
      acc += peek;
      this.advance();
    }
    return acc;
  }

  string() {
    let acc = '';
    for (
      let peek = this.peek();
      peek !== null && isLowerAlpha(peek);
      peek = this.peek()
    ) {
      acc += peek;
      this.advance();
    }
    return acc;
  }
}
```

We can test the program like, this:

```ts
for (const token of new Lexer('a + 45')) {
  console.log(token);
}
```

This should print out:

```
{ type: "Name", data: "a" }
{ type: "+" }
{ type: "Number", data: "45" }
```

# Becoming Whitespace Sensitive

Right now our language ignores all whitespace betwen characters:

```
let x = a + b in x + x
```

Lexes the exact same way as

```
let x
= a +
b     in x +
  x
```

Additionally, we require explicit semicolons and braces to be able to handle the structure
of our program. If we had written the parser, it would be working on semicolon tokens
and brace tokens:

```
{
f = x => x * x;

y =
  let {
    z = 4
  } in z + f z
}
```

I mentioned that we won't go into parsing in this post. The reason is that a parser
working on explicit semicolons and braces will be just fine. Our goal is to modify
how the lexer works to become whitespace sensitive, while keeping the parser the same.

To do this, we need to be able to look at the indentation