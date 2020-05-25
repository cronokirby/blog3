function *iterString(input: string) {
  for (const c of input) {
    yield c;
  }
}

type Peeked<T> = { ready: true; value: T } | { ready: false };

class Peekable<T> implements IterableIterator<T> {
  private _peeked: Peeked<T> = { ready: false };
  private _iter: Iterator<T>;

  constructor(iter: Iterable<T>) {
    this._iter = iter[Symbol.iterator]();
  }

  peek() {
    if (this._peeked.ready) {
      return { done: false, value: this._peeked.value };
    } else {
      const result = this._iter.next();
      if (!result.done) {
        this._peeked = { ready: true, value: result.value };
      }
      return result;
    }
  }

  next() {
    if (this._peeked.ready) {
      const value = this._peeked.value;
      this._peeked = { ready: false };
      return { done: false, value };
    } else {
      return this._iter.next();
    }
  }

  [Symbol.iterator]() {
    return this;
  }
}

enum LinePos {
  Start,
  Middle,
}

interface Annotated<T> {
  item: T;
  linePos: LinePos;
  col: number;
}

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
  Name = 'Name',
}

interface Token {
  readonly type: TokenType;
  readonly data?: string;
}

function isNumber(char: string): boolean {
  return /[0-9]/.test(char);
}

function isLowerAlpha(char: string): boolean {
  return /[a-z]/.test(char);
}

function isWhitespace(char: string): boolean {
  return /[\n\r\s]/.test(char);
}

class Lexer implements Iterable<Token> {
  private _iter: Peekable<string>;

  constructor(input: string) {
    this._iter = new Peekable(iterString(input));
  }

  *[Symbol.iterator]() {
    for (let peek = this._iter.peek(); !peek.done; peek = this._iter.peek()) {
      switch (peek.value) {
        case '=':
          this._iter.next();
          yield { type: TokenType.Equal };
          break;
        case '+':
          this._iter.next();
          yield { type: TokenType.Plus };
          break;
        case '{':
          this._iter.next();
          yield { type: TokenType.LeftBrace };
          break;
        case '}':
          this._iter.next();
          yield { type: TokenType.RightBrace };
          break;
        case ';':
          this._iter.next();
          yield { type: TokenType.SemiColon };
          break;
        default:
          if (isNumber(peek.value)) {
            const data = this.number();
            yield { type: TokenType.Number, data };
          } else if (isLowerAlpha(peek.value)) {
            const data = this.string();
            if (data === 'let') {
              yield { type: TokenType.Let };
            } else if (data === 'in') {
              yield { type: TokenType.In };
            } else {
              yield { type: TokenType.Name, data };
            }
          } else if (isWhitespace(peek.value)) {
            this._iter.next();
          } else {
            throw new Error(`Unrecognized character: '${peek.value}'`);
          }
          break;
      }
    }
  }

  number() {
    let acc = '';
    for (
      let peek = this._iter.peek();
      !peek.done && isNumber(peek.value);
      peek = this._iter.peek()
    ) {
      acc += peek.value;
      this._iter.next();
    }
    return acc;
  }

  string() {
    let acc = '';
    for (
      let peek = this._iter.peek();
      !peek.done && isLowerAlpha(peek.value);
      peek = this._iter.peek()
    ) {
      acc += peek.value;
      this._iter.next();
    }
    return acc;
  }
}

function main(input: string) {
  const lexer = new Lexer(input);
  for (const token of lexer) {
    console.log(token);
  }
}

const args = Deno.args;
if (args.length < 1) {
  console.log('not enough arguments');
} else {
  main(args[0]);
}
