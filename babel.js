module.exports = () => {
  return {
    visitor: {
      ImportDeclaration(path) {
        const { source } = path.node

        let hasAotComment
        if (source.leadingComments) {
          source.leadingComments = source.leadingComments.filter(comment => {
            const isAot = comment.value.trim() === 'aot'
            if (isAot) {
              hasAotComment = true
            }
            return !isAot
          })
        }

        if (hasAotComment) {
          path.node.source.value += '?aot'
        }
      }
    }
  }
}
