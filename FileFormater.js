const fs = require('fs')

class FileFormatter {

    static trimWhiteSpaces(file) {
        const lines = fs.readFileSync(file).toString().split("\n")
        const newLines = lines.map((line) => line.trim())
        fs.writeFileSync(file, Buffer.from(newLines.join("\n")))
    }
}

module.exports = FileFormatter
