import mermaid from 'mermaid';
// import mermaidUtils from 'mermaid/src/utils';
// import flowRenderer from 'mermaid/src/diagrams/flowchart/flowRenderer';
// import sequenceRenderer from 'mermaid/src/diagrams/sequence/sequenceRenderer';
// import ganttRenderer from 'mermaid/src/diagrams/gantt/ganttRenderer';
// import classRenderer from 'mermaid/src/diagrams/class/classRenderer';
// import gitGraphRenderer from 'mermaid/src/diagrams/git/gitGraphRenderer';
import extensionSvc from '../services/extensionSvc';
import utils from '../services/utils';

const { mermaidAPI } = mermaid;

const config = {
  logLevel: 5,
  startOnLoad: false,
  arrowMarkerAbsolute: false,
  flowchart: {
    htmlLabels: true,
    curve: 'linear',
  },
  sequence: {
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    width: 150,
    height: 65,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    mirrorActors: true,
    bottomMarginAdj: 1,
    useMaxWidth: true,
  },
  gantt: {
    titleTopMargin: 25,
    barHeight: 20,
    barGap: 4,
    topPadding: 50,
    leftPadding: 75,
    gridLineStartPadding: 35,
    fontSize: 11,
    fontFamily: '"Open-Sans", "sans-serif"',
    numberSectionStyles: 4,
    axisFormat: '%Y-%m-%d',
  },
  class: {},
  git: {},
};

mermaidAPI.initialize(config);

const containerElt = document.createElement('div');
containerElt.className = 'hidden-rendering-container';
document.body.appendChild(containerElt);

const render = (elt) => {
  const svgId = `mermaid-svg-${utils.uid()}`;
  const txt = elt.textContent;

  try {
    mermaidAPI.render(svgId, txt, (svgCode, bindFunctions) => {
      containerElt.innerHTML = svgCode;
      elt.parentNode.replaceChild(containerElt.firstChild, elt);
      if (bindFunctions) {
        bindFunctions(elt.parentNode);
      }
    }, containerElt);
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
  }
};

extensionSvc.onGetOptions((options, properties) => {
  options.mermaid = properties.extensions.mermaid.enabled;
});

extensionSvc.onSectionPreview((elt) => {
  elt.querySelectorAll('.prism.language-mermaid')
    .cl_each((diagramElt) => render(diagramElt.parentNode));
});
