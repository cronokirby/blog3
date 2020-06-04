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
  Start = 'Start',
  Middle = 'Middle',
}

interface Annotated<T> {
  item: T;
  linePos: LinePos;
  col: number;
}

function isWhitespace(char: string): boolean {
  return /[\n\r\s]/.test(char);
}

function* annotate(input: Iterable<string>) {
  let linePos = LinePos.Start;
  let col = 0;
  for (const c of input) {
    yield { item: c, linePos, col };
    if (c === '\n' || c === '\r') {
      linePos = LinePos.Start;
      col = 0;
    } else {
      col += 1;
      if (linePos === LinePos.Start) {
        linePos = LinePos.Middle;
      }
    }
  }
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

function startsLayout(typ: TokenType) {
  return typ === TokenType.Let;
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

class Lexer implements Iterable<Annotated<Token>> {
  private _iter: Peekable<Annotated<string>>;

  constructor(input: Iterable<Annotated<string>>) {
    this._iter = new Peekable(input);
  }

  *[Symbol.iterator]() {
    for (let peek = this._iter.peek(); !peek.done; peek = this._iter.peek()) {
      const item = peek.value.item;
      switch (item) {
        case '=':
          this._iter.next();
          yield { ...peek.value, item: { type: TokenType.Equal } };
          break;
        case '+':
          this._iter.next();
          yield { ...peek.value, item: { type: TokenType.Plus } };
          break;
        case '{':
          this._iter.next();
          yield { ...peek.value, item: { type: TokenType.LeftBrace } };
          break;
        case '}':
          this._iter.next();
          yield { ...peek.value, item: { type: TokenType.RightBrace } };
          break;
        case ';':
          this._iter.next();
          yield { ...peek.value, item: { type: TokenType.SemiColon } };
          break;
        default:
          if (isNumber(item)) {
            const data = this.number();
            yield { ...peek.value, item: { type: TokenType.Number, data } };
          } else if (isLowerAlpha(item)) {
            const data = this.string();
            if (data === 'let') {
              yield { ...peek.value, item: { type: TokenType.Let } };
            } else if (data === 'in') {
              yield { ...peek.value, item: { type: TokenType.In } };
            } else {
              yield { ...peek.value, item: { type: TokenType.Name, data } };
            }
          } else if (isWhitespace(item)) {
            this._iter.next();
          } else {
            throw new Error(`Unrecognized character: '${item}'`);
          }
          break;
      }
    }
  }

  number() {
    let acc = '';
    for (
      let peek = this._iter.peek();
      !peek.done && isNumber(peek.value.item);
      peek = this._iter.peek()
    ) {
      acc += peek.value.item;
      this._iter.next();
    }
    return acc;
  }

  string() {
    let acc = '';
    for (
      let peek = this._iter.peek();
      !peek.done && isLowerAlpha(peek.value.item);
      peek = this._iter.peek()
    ) {
      acc += peek.value.item;
      this._iter.next();
    }
    return acc;
  }
}

type Layout = { type: 'Explicit' } | { type: 'IndentedBy'; amount: number };

function indentedMore(layout: Layout, than: Layout) {
  if (than.type === 'Explicit') {
    return layout.type !== 'Explicit';
  } else if (layout.type === 'Explicit') {
    return indentedMore(than, layout);
  } else {
    return layout.amount > than.amount;
  }
}

function sameIndentation(layout: Layout, comparedTo: Layout) {
  if (layout.type !== comparedTo.type) {
    return false;
  }
  if (layout.type === 'Explicit' || comparedTo.type === 'Explicit') {
    return true;
  }
  return layout.amount === comparedTo.amount;
}

function* layout(input: Iterable<Annotated<Token>>) {
  let layouts: Layout[] = [];
  const topLayout = () => (layouts.length > 0 ? layouts[0] : null);
  let expectingLayout = true;

  for (const { col, linePos, item } of input) {
    let shouldHandleIndent = linePos === LinePos.Start;

    if (item.type === TokenType.RightBrace) {
      shouldHandleIndent = false;
      if (topLayout()?.type === 'Explicit') {
        layouts.pop();
      } else {
        throw Error('unmatched }');
      }
    } else if (startsLayout(item.type)) {
      shouldHandleIndent = false;
      expectingLayout = true;
    } else if (expectingLayout) {
      expectingLayout = false;
      shouldHandleIndent = false;

      if (item.type === TokenType.LeftBrace) {
        layouts.push({ type: 'Explicit' });
      } else {
        const newIndentation: Layout = { type: 'IndentedBy', amount: col };
        const currentIndentation = topLayout() ?? { type: 'Explicit' };
        if (indentedMore(newIndentation, currentIndentation)) {
          layouts.push(newIndentation);
          yield { type: TokenType.LeftBrace };
        } else {
          yield { type: TokenType.LeftBrace };
          yield { type: TokenType.RightBrace };
          shouldHandleIndent = true;
        }
      }
    }

    if (shouldHandleIndent) {
      const newIndentation: Layout = { type: 'IndentedBy', amount: col };
      for (
        let layout = topLayout();
        layout && indentedMore(layout, newIndentation);
        layout = topLayout()
      ) {
        layouts.pop();
        yield { type: TokenType.RightBrace };
      }
      const current = topLayout();
      if (current && sameIndentation(current, newIndentation)) {
        yield { type: TokenType.SemiColon };
      }
    }

    yield item;
  }
}

function main(input: string) {
  const lexer = new Lexer(annotate(input));
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
