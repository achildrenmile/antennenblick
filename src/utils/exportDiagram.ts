import html2canvas from 'html2canvas';

export async function exportDiagramAsPng(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#1a1d23',
      scale: 2, // Higher resolution
      logging: false,
    });

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error exporting diagram:', error);
  }
}

export async function exportAllDiagrams(filename: string): Promise<void> {
  const diagramsElement = document.querySelector('.diagrams');
  if (!diagramsElement) {
    console.error('Diagrams element not found');
    return;
  }

  try {
    const canvas = await html2canvas(diagramsElement as HTMLElement, {
      backgroundColor: '#1a1d23',
      scale: 2,
      logging: false,
    });

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error exporting diagrams:', error);
  }
}

export async function exportFullConfig(filename: string): Promise<void> {
  const visualizationElement = document.querySelector('.visualization');
  if (!visualizationElement) {
    console.error('Visualization element not found');
    return;
  }

  try {
    const canvas = await html2canvas(visualizationElement as HTMLElement, {
      backgroundColor: '#1a1d23',
      scale: 2,
      logging: false,
      windowWidth: 1200, // Ensure enough width
    });

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error exporting configuration:', error);
  }
}
