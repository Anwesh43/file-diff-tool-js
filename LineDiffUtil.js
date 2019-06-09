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

    static deleteModifiedLines(map, list, changes) {
        changes.forEach((change) => {
            delete(map[list[change.oldIndex]])
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
                changes.push({line, oldIndex})
                delete oldLineIndexMap[line]
            }
            else {
                if (newIndex < oldIndex) {
                    LineDiffUtil.appendToList(deletions, changes)
                } else {
                    LineDiffUtil.deleteModifiedLines(newLineIndexMap, newLines, changes)
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
        const oldLines = fs.readFileSync(oldFile).toString().split("\n")
        const newLines = fs.readFileSync(newFile).toString().split("\n")
        return LineDiffUtil.compare(oldLines, newLines)
    }
}

module.exports = LineDiffUtil
