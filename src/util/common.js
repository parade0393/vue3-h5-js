export function trueValue(value,includeZero = true,defaultValue = ''){
  if (typeof value === 'number') {
    if (includeZero) {
      if (value === 0) {
        return value
      }
    }
  }
  return value || defaultValue
}
