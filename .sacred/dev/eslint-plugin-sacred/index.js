/**
 * ESLint Plugin - Sacred
 * Custom rules for conscious coding
 */

module.exports = {
  rules: {
    /**
     * Presence First Rule
     * Functions should begin with presence/intention
     */
    'presence-first': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Ensure functions begin with presence',
          category: 'Sacred Practices'
        },
        messages: {
          missingPresence: 'Function {{name}} should begin with presence (comment or pause)'
        }
      },
      create(context) {
        return {
          FunctionDeclaration(node) {
            const functionName = node.id ? node.id.name : 'anonymous';
            const firstStatement = node.body.body[0];
            
            if (!firstStatement) return;
            
            // Check for presence indicators
            const hasPresenceComment = context.getCommentsBefore(firstStatement)
              .some(comment => 
                comment.value.includes('intention') ||
                comment.value.includes('presence') ||
                comment.value.includes('🙏') ||
                comment.value.includes('✨')
              );
            
            const hasPresencePause = firstStatement.type === 'ExpressionStatement' &&
              firstStatement.expression.type === 'CallExpression' &&
              (firstStatement.expression.callee.name === 'sacredPause' ||
               firstStatement.expression.callee.name === 'breathe');
            
            if (!hasPresenceComment && !hasPresencePause) {
              context.report({
                node: node.id || node,
                messageId: 'missingPresence',
                data: { name: functionName }
              });
            }
          }
        };
      }
    },
    
    /**
     * Mindful Naming Rule
     * Variable names should reflect consciousness
     */
    'mindful-naming': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Encourage mindful variable naming',
          category: 'Sacred Practices'
        },
        messages: {
          unmindfulName: 'Variable "{{name}}" could be more mindful (avoid: temp, data, obj, val)'
        }
      },
      create(context) {
        const unmindfulPatterns = /^(temp|tmp|data|obj|val|var|foo|bar|test)$/i;
        
        return {
          VariableDeclarator(node) {
            if (node.id.type === 'Identifier') {
              const name = node.id.name;
              
              if (unmindfulPatterns.test(name)) {
                context.report({
                  node: node.id,
                  messageId: 'unmindfulName',
                  data: { name }
                });
              }
            }
          }
        };
      }
    },
    
    /**
     * Contemplative Comments Rule
     * Comments should add wisdom, not just description
     */
    'contemplative-comments': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Ensure comments add wisdom',
          category: 'Sacred Practices'
        },
        messages: {
          shallowComment: 'Comment could be more contemplative: "{{comment}}"'
        }
      },
      create(context) {
        const shallowPatterns = [
          /^\/\/\s*(TODO|FIXME|HACK)/i,
          /^\/\/\s*[A-Z][a-z]+\s+[a-z]+$/,  // "Get data"
          /^\/\/\s*[a-z]+$/i                // Single word
        ];
        
        return {
          Program() {
            const comments = context.getSourceCode().getAllComments();
            
            comments.forEach(comment => {
              const isShallow = shallowPatterns.some(pattern => 
                pattern.test(comment.value.trim())
              );
              
              if (isShallow && !comment.value.includes('🕊️')) {
                context.report({
                  node: comment,
                  messageId: 'shallowComment',
                  data: { comment: comment.value.trim().substring(0, 30) }
                });
              }
            });
          }
        };
      }
    },
    
    /**
     * Sacred Numbers Rule
     * Encourage use of sacred numbers (3, 7, 11, etc.)
     */
    'sacred-numbers': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Encourage sacred number usage',
          category: 'Sacred Practices'
        },
        messages: {
          considerSacred: 'Consider using sacred number (3, 7, 11) instead of {{value}}'
        }
      },
      create(context) {
        const sacredNumbers = [1, 3, 4, 7, 11, 13, 21, 33, 87];
        const closeNumbers = {
          2: 3, 5: 4, 6: 7, 8: 7, 9: 11, 10: 11,
          12: 11, 14: 13, 20: 21, 30: 33
        };
        
        return {
          Literal(node) {
            if (typeof node.value === 'number' && 
                node.value > 1 && 
                !sacredNumbers.includes(node.value) &&
                closeNumbers[node.value]) {
              
              // Don't report for array indices or time values
              if (node.parent.type === 'MemberExpression') return;
              if (node.parent.type === 'CallExpression' && 
                  node.parent.callee.name === 'setTimeout') return;
              
              context.report({
                node,
                messageId: 'considerSacred',
                data: { value: node.value }
              });
            }
          }
        };
      }
    }
  }
};