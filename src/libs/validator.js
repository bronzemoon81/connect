import validator from "joi";

export default function (params, rules) {
  const validateSchema = validator.object().keys(rules).messages({
    "any.required": "{{#label}} boş bırakılamaz.",
    "string.empty": "{{#label}} boş bırakılamaz.",
    "string.email": "{{#label}} mutlaka geçerli bir e-posta adresi olmalıdır.",
    "string.length":
      "{{#label}} uzunluğu, {{#limit}} karakter uzunluğunda olmalıdır.",
    "string.max":
      "{{#label}} uzunluğu, {{#limit}} karakter uzunluğundan küçük veya bu karakter sayısına eşit olmalıdır.",
    "string.min":
      "{{#label}} uzunluğu, {{#limit}} karakter uzunluğundan büyük veya bu karakter sayısına eşit olmalıdır.",
    "string.lowercase":
      "{{#label}} yalnızca küçük harf karakterler içermelidir.",
    "string.uppercase":
      "{{#label}} yalnızca büyük harf karakterler içermelidir.",
    "string.trim": "{{#label}} başında veya sonunda boşluk olmamalıdır.",
    "string.uri": "{{#label}}, geçerli bir url olmalıdır.",

    "number.base": "{{#label}} mutlaka bir sayı olmalıdır.",
    "number.integer": "{{#label}} mutlaka bir tam sayı olmalıdır.",
    "number.greater": "{{#label}}, {{#limit}} değerinden büyük olmalıdır.",
    "number.less": "{{#label}}, {{#limit}} değerinden küçük olmalıdır.",
    "number.max":
      "{{#label}}, {{#limit}} değerinden küçük veya bu değere eşit olmalıdır.",
    "number.min":
      "{{#label}}, {{#limit}} değerinden büyük veya bu değere eşit olmalıdır.",

    "date.base": "{{#label}} mutlaka bir tarih olmalıdır.",
    "date.format":
      '{{#label}}, {msg("date.format." + #format) || #format} belirtilen tarih biçimi şeklinde olmalıdır.',
    "date.greater": "{{#label}}, {{:#limit}} tarihinden büyük olmalıdır.",
    "date.less": "{{#label}}, {{:#limit}} tarihinden küçük olmalıdır.",
    "date.max": "{{#label}}, {{:#limit}} tarihinden küçük veya eşit olmalıdır.",
    "date.min": "{{#label}}, {{:#limit}} tarihinden büyük veya eşit olmalıdır.",
  });

  const validated = validateSchema.validate(params, {
    allowUnknown: true,
    abortEarly: false,
  });

  const errorDetails = _.get(validated, "error.details") || [];
  if (errorDetails.length === 0) return null;

  const errors = {};

  errorDetails.map((error) => {
    const errorPath = _.get(error, "path") || [];
    const errorMessage = _.get(error, "message") || "";
    errors[errorPath.join(".")] = [errorMessage];
  });

  return {
    kind: "validation",
    message: _.get(errorDetails, "0.message", ""),
    fields: errors,
  };
}
