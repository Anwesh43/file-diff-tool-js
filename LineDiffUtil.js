const fs = require('fs')
class LineDiffUtil {

    static createLineIndexMap(lines) {
        const lineIndexMap = {}
        lines.forEach((line, index) => {
            lineIndexMap[line] = index
        })
        return lineIndexMap
    }

    static appendToList(list, copy) {
        copy.forEach((elem) => {
            list.push(elem)
        })
    }

    static compare(oldLines, newLines) {
        const insertions = []
        const modifications = []
        const deletions = []
        const oldLineIndexMap = LineDiffUtil.createLineIndexMap(oldLines)
        const newLineIndexMap = LineDiffUtil.createLineIndexMap(newLines)
        var changes = []
        Object.keys(oldLineIndexMap).forEach((line) => {
            const oldIndex = oldLineIndexMap[line]
            const newIndex = newLineIndexMap[line]
            if (!newIndex) {
                changes.push({line, index})
            }
            else {
                if (oldIndex != newIndex && changes.length != 0) {
                    if (newIndex < oldIndex) {
                        LineDiffUtil.appendToList(deletions, changes)
                    } else {
                        LineDiffUtil.appendToList(insertions, changes)
                    }
                    changes = []
                }

                if (oldIndex == newIndex && changes.length > 0) {
                    LineDiffUtil.appendToList(modifications, changes)
                }
                delete newLineIndexMap[line]
                delete oldLineIndexMap[line]
                changes = []
            }
        })
        Object.keys(newLineIndexMap).forEach((line) => {
            insertions.push({line, index : newLineIndexMap[line]})
        })

        Object.keys(oldLineIndexMap).forEach((line) => {
            deletions.push({line, index : oldLineIndexMap[line]})
        })
        return {insertions, deletions, modifications}
    }

    static compareFiles(oldFile, newFile) {
        const oldLines = fs.readFileSync(oldFile)
        const newLines = fs.readFileSync(newFile)
        return LineDiffUtil.compare(oldLines, newLines)
    }
}

module.exports = LineDiffUtil
