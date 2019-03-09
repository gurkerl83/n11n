const oExceptions = ['echo', 'embargo', 'hero', 'potato', 'tomato', 'veto', 'volcano'];

/**
 * Returns the plural form of a word.
 *
 * If it's too far off norms, it will deliberately be wrong e.g. `goose -> gooses`.
 *
 * If not a string will return `''`
 * @param word Word to get its plural form
 */
export function pluralize(word: string): string {
  if (!word || typeof word !== 'string') {
    return '';
  }

  const { concat, ifEndsWith, ifEndsWithEither, ifIsIn } = helpersFor(word);

  return (
    ifEndsWith('ex').replace('ices') ||
    ifEndsWith('us').replace('i') ||
    ifEndsWith('oof').concat('s') ||
    ifEndsWith('f').replace('ves') ||
    ifEndsWith('fe').replace('ves') ||
    ifEndsWith('is').replace('es') ||
    ifEndsWith('um').replace('a') ||
    ifIsIn(...oExceptions).concat('es') ||
    ifEndsWith('o').concat('s') ||
    ifEndsWith('y').then(({ replace }) =>
      /[aeiou]y$/.test(word) ? concat('s') : replace('ies')
    ) ||
    ifEndsWithEither('craft').keep() ||
    ifEndsWithEither('ch', 'sh', 's', 'x', 'z').concat('es') ||
    concat('s')
  );
}

function helpersFor(word: string) {
  word = word.trim().toLowerCase();

  const concat = (chars: string) => word + chars;
  const end = (): string => null as any;

  const ifEndsWith = (chars: string) => {
    if (!word.endsWith(chars)) {
      return { concat: end, replace: end, then: end };
    }

    const replace = (repl: string) => word.slice(0, -chars.length) + repl;

    return {
      concat,
      replace,
      then: (fn: ({  }: { replace: (chars: string) => string }) => string) =>
        fn({ replace }),
    };
  };

  const ifEndsWithEither = (...chars: string[]) =>
    chars.some(char => word.endsWith(char))
      ? { concat, keep: () => word }
      : { concat: end, keep: end };

  const ifIsIn = (...words: string[]) =>
    words.includes(word) ? { concat } : { concat: end };

  return {
    concat,
    ifEndsWith,
    ifEndsWithEither,
    ifIsIn,
  };
}