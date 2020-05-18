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
          } else if (isWhitespace(peek)) {
            this.advance();
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
