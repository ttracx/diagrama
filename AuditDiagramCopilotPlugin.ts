
// Audit Diagram Copilot Plugin for Generating Mermaid.js Diagrams from Textual Descriptions

export interface ProcessDescription {
  description: string;
}

export interface MermaidDiagram {
  code: string;
  explanation: string;
}

/**
 * Converts textual descriptions of processes into Mermaid.js diagrams.
 * @param input ProcessDescription containing the process described in natural language.
 * @returns MermaidDiagram with the generated Mermaid.js code and an explanation of the diagram.
 */
export function generateMermaidDiagram(input: ProcessDescription): MermaidDiagram {
  const steps = parseDescription(input.description);
  const mermaidCode = generateMermaidCode(steps);
  const explanation = explainCode(steps);
  return { code: mermaidCode, explanation };
}

/**
 * Parses the textual description to identify the sequence of steps and decisions.
 * @param description String containing the natural language process description.
 * @returns An array of steps and decision points.
 */
function parseDescription(description: string): Array<any> {
  // Example parser logic (should be replaced with actual natural language processing logic)
  const steps = description.split(' -> ');
  return steps.map(step => {
    if (step.includes('If')) {
      const [condition, paths] = step.split(', ');
      return { type: 'decision', condition, paths };
    }
    return { type: 'step', description: step };
  });
}

/**
 * Generates Mermaid.js code from the parsed steps and decisions.
 * @param steps Array of parsed steps and decision points.
 * @returns String containing Mermaid.js code.
 */
function generateMermaidCode(steps: Array<any>): string {
  let mermaidCode = 'graph TD;
';
  let lastNode = 'A';
  steps.forEach((step, index) => {
    const currentNode = String.fromCharCode(lastNode.charCodeAt(0) + index);
    if (step.type === 'step') {
      mermaidCode += `${lastNode} --> ${currentNode}[${step.description}];
";
    } else if (step.type === 'decision') {
      step.paths.forEach((path: string, idx: number) => {
        const pathNode = `${currentNode}${idx + 1}";
        mermaidCode += `${lastNode} -->|${path}| ${pathNode};
";
      });
    }
    lastNode = currentNode;
  });
  return mermaidCode;
}

/**
 * Provides explanations for each segment of the Mermaid.js code.
 * @param steps Array of parsed steps and decision points.
 * @returns String containing explanations for the Mermaid.js code.
 */
function explainCode(steps: Array<any>): string {
  let explanations = "Explanation of the diagram:
";
  steps.forEach((step, index) => {
    if (step.type === 'step') {
      explanations += `Step ${index + 1}: ${step.description}
";
    } else if (step.type === 'decision') {
      explanations += `Decision at Step ${index + 1}: ${step.condition} with paths ${step.paths.join(', ')}
";
    }
  });
  return explanations;
}
