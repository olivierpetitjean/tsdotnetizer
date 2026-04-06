/**
 * Culture information and globalization utilities
 */

/**
 * Provides information about a specific culture.
 * Simplified version of .NET's CultureInfo.
 */
export class CultureInfo {
  private static _current: CultureInfo | undefined;
  private _decimalSeparator = '.';
  private _language = 'en';
  private _dateFormat = 'yyyy-MM-dd';
  private _timeFormat = 'HH:mm:ss';

  /**
   * Gets or sets the current culture.
   */
  static get current(): CultureInfo {
    if (!CultureInfo._current) {
      CultureInfo._current = new CultureInfo();
    }
    return CultureInfo._current;
  }

  static set current(value: CultureInfo) {
    CultureInfo._current = value;
  }

  /**
   * Creates a new CultureInfo with default values.
   */
  constructor() {
    // Detect locale using Intl (works in both Node.js and browsers)
    try {
      const locale = Intl.DateTimeFormat().resolvedOptions().locale;
      this._language = locale.substring(0, 2);
    } catch {
      this._language = 'en';
    }

    // Set decimal separator based on locale
    const testNumber = 1.1;
    const formatted = testNumber.toLocaleString(this._language);
    this._decimalSeparator = formatted.includes(',') ? ',' : '.';
  }

  /**
   * Gets the decimal separator for numeric values.
   */
  get decimalSeparator(): string {
    return this._decimalSeparator;
  }

  /**
   * Sets the decimal separator for numeric values.
   */
  set decimalSeparator(value: string) {
    this._decimalSeparator = value;
  }

  /**
   * Gets the language code (e.g., 'en', 'fr').
   */
  get language(): string {
    return this._language;
  }

  /**
   * Sets the language code.
   */
  set language(value: string) {
    this._language = value;
  }

  /**
   * Gets the default date format string.
   */
  get dateFormat(): string {
    return this._dateFormat;
  }

  /**
   * Sets the default date format string.
   */
  set dateFormat(value: string) {
    this._dateFormat = value;
  }

  /**
   * Gets the default time format string.
   */
  get timeFormat(): string {
    return this._timeFormat;
  }

  /**
   * Sets the default time format string.
   */
  set timeFormat(value: string) {
    this._timeFormat = value;
  }
}
