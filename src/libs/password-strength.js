export const PasswordCheckStrength = {
  None: 0,
  Short: 1,
  Weak: 2,
  Ok: 3,
  Strong: 4,
};

// Object to check password strengths and various properties
export class PasswordCheckService {
  // Expected length of all passwords
  static get MinimumLength() {
    return 5;
  }

  // Regex to check for a common password string - all based on 5+ length passwords
  commonPasswordPatterns =
    /passw.*|12345.*|09876.*|qwert.*|asdfg.*|zxcvb.*|footb.*|baseb.*|drago.*/;

  //
  // Checks if the given password matches a set of common password
  //
  isPasswordCommon(password) {
    return this.commonPasswordPatterns.test(password);
  }

  //
  // Returns the strength of the current password
  //
  checkPasswordStrength(password) {
    // Build up the strenth of our password
    let numberOfElements = 0;
    numberOfElements = /.*[a-z].*/.test(password)
      ? ++numberOfElements
      : numberOfElements; // Lowercase letters
    numberOfElements = /.*[A-Z].*/.test(password)
      ? ++numberOfElements
      : numberOfElements; // Uppercase letters
    numberOfElements = /.*[0-9].*/.test(password)
      ? ++numberOfElements
      : numberOfElements; // Numbers
    numberOfElements = /[^a-zA-Z0-9]/.test(password)
      ? ++numberOfElements
      : numberOfElements; // Special characters (inc. space)

    // Assume we have a poor password already
    let currentPasswordStrength = PasswordCheckStrength.Short;

    // Check then strenth of this password using some simple rules
    if (!password) {
      currentPasswordStrength = PasswordCheckStrength.None;
    } else if (password.length < PasswordCheckService.MinimumLength) {
      currentPasswordStrength = PasswordCheckStrength.Short;
    } else if (
      numberOfElements === 0 ||
      numberOfElements === 1 ||
      numberOfElements === 2
    ) {
      currentPasswordStrength = PasswordCheckStrength.Weak;
    } else if (numberOfElements === 3) {
      currentPasswordStrength = PasswordCheckStrength.Ok;
    } else {
      currentPasswordStrength = PasswordCheckStrength.Strong;
    }

    // Return the strength of this password
    return currentPasswordStrength;
  }
}
