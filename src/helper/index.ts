/**
 * Class based on https://github.com/poppinss/utils/blob/develop/src/Helpers/string.ts
 */

import { addIrregularRule, addUncountableRule, plural, singular } from 'pluralize'
import { truncatise } from 'truncatise'
import * as changeCase from 'change-case'

export default class Helper {
  private SMALL_WORDS = /\b(?:an?d?|a[st]|because|but|by|en|for|i[fn]|neither|nor|o[fnr]|only|over|per|so|some|tha[tn]|the|to|up|upon|vs?\.?|versus|via|when|with|without|yet)\b/i
  private TOKENS = /[^\s:–—-]+|./g
  private WHITESPACE = /\s/
  private IS_MANUAL_CASE = /.(?=[A-Z]|\..)/
  private ALPHANUMERIC_PATTERN = /[A-Za-z0-9\u00C0-\u00FF]/

  /**
   * The method is a copy/paste from the "title-case" package. They have
   * a dependency on "tslib", which I don't want.
   */
  public titleCase (input: string) {
    let output = ''
    let result: RegExpExecArray | null

    while ((result = this.TOKENS.exec(input)) !== null) {
      const { 0: token, index } = result

      if (
        !this.IS_MANUAL_CASE.test(token) &&
        (!this.SMALL_WORDS.test(token) || index === 0 || index + token.length === input.length) &&
        (input.charAt(index + token.length) !== ':' ||
          this.WHITESPACE.test(input.charAt(index + token.length + 1)))
      ) {
        output += token.replace(this.ALPHANUMERIC_PATTERN, (char) => char.toUpperCase())
        continue
      }

      output += token
    }

    return output
  }

  /**
   * Normalizes base64 string by removing special chars and padding
   */
  public normalizeBase64 (value: string) {
    return value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  /**
   * Define an irregular rule
   */
  public defineIrregularRule (singleValue: string, pluralValue: string) {
    addIrregularRule(singleValue, pluralValue)
  }

  /**
   * Define uncountable rule
   */
  public defineUncountableRule (word: string) {
    addUncountableRule(word)
  }

  /**
   * Convert string to camelcase
   */
  public camelCase (value: string): string {
    return changeCase.camelCase(value)
  }

  /**
   * Convert string to snakecase
   */
  public snakeCase (value: string): string {
    return changeCase.snakeCase(value)
  }

  /**
   * Convert string to dashcase
   */
  public dashCase (value: string, options?: { capitalize?: boolean }): string {
    if (options && options.capitalize) {
      return changeCase.headerCase(value)
    }

    return changeCase.paramCase(value)
  }

  /**
   * Convert string to pascal case
   */
  public pascalCase (value: string): string {
    return changeCase.pascalCase(value)
  }

  /**
   * Convert string to capital case
   */
  public capitalCase (value: string): string {
    return changeCase.capitalCase(value)
  }

  /**
   * Convert string to sentence case
   */
  public sentenceCase (value: string): string {
    return changeCase.sentenceCase(value)
  }

  /**
   * Convert string to dot case
   */
  public dotCase (value: string): string {
    return changeCase.dotCase(value)
  }

  /**
   * Remove all sort of casing from the string
   */
  public noCase (value: string): string {
    return changeCase.noCase(value)
  }

  /**
   * Pluralize a word
   */
  public pluralize (word: string): string {
    return plural(word)
  }

  /**
   * Singularize a word
   */
  public singularize (word: string): string {
    return singular(word)
  }

  /**
   * Truncate a sentence till a give limit of characters
   */
  public truncate (
    sentence: string,
    charactersLimit: number,
    options?: {
      completeWords?: boolean
      suffix?: string
    }
  ): string {
    return truncatise(sentence, {
      TruncateLength: charactersLimit,
      /**
       * Do not complete words when "completeWords" is not explicitly set
       * to true
       */
      Strict: !(options && options.completeWords === true),
      StripHTML: false,
      TruncateBy: 'characters',
      Suffix: options && options.suffix
    })
  }

  /**
   * Condenses multiple whitespaces from a string
   */
  public condenseWhitespace (value: string): string {
    return value.trim().replace(/\s{2,}/g, ' ')
  }

  /**
   * Convert array of values to a sentence
   */
  public toSentence (
    values: any[],
    options?: {
      separator?: string
      pairSeparator?: string
      lastSeparator?: string
    }
  ): string {
    /**
     * Empty array
     */
    if (values.length === 0) {
      return ''
    }

    /**
     * Just one item
     */
    if (values.length === 1) {
      return values[0]
    }

    /**
     * Giving some love to two items, so that one can use oxford comma's
     */
    if (values.length === 2) {
      return `${values[0]}${options?.pairSeparator || ' and '}${values[1]}`
    }

    const normalized = Object.assign({ separator: ', ', lastSeparator: ', and ' }, options)

    /**
     * Make sentence
     */
    return `${values.slice(0, -1).join(normalized.separator)}${normalized.lastSeparator}${
      values[values.length - 1]
    }`
  }

  /**
   * Find if a string is empty. Including any number of whitespaces
   */
  public isEmpty (value: string): boolean {
    return value.trim().length === 0
  }

  /**
   * Ordinalize a give number or string
   */
  public ordinalize (value: string | number): string {
    const transformedValue = Math.abs(typeof value === 'string' ? parseInt(value) : value)
    if (!Number.isFinite(transformedValue) || Number.isNaN(transformedValue)) {
      throw new Error('Cannot ordinalize NAN or infinite numbers')
    }

    const percent = transformedValue % 100
    if (percent >= 10 && percent <= 20) {
      return `${value}th`
    }

    const decimal = {
      1: () => `${value}st`,
      2: () => `${value}nd`,
      3: () => `${value}rd`,
      unknown: () => `${value}th`
    }

    return (decimal[transformedValue % 10] || decimal.unknown)()
  }
}