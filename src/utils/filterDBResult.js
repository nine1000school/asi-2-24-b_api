const filterDBResult = (rows) =>
  (Array.isArray(rows) ? rows : [rows]).map((row) => {
    // eslint-disable-next-line no-unused-vars
    const { passwordHash, passwordSalt, ...sanitizedRow } = row

    return sanitizedRow
  })

export default filterDBResult
