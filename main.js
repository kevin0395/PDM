import * as OBC from 'openbim-components';

async function createPreview(container, fileUrl) {
  const components = new OBC.Components();
  components.scene = new OBC.SimpleScene(components);
  components.renderer = new OBC.SimpleRenderer(components, container);
  components.camera = new OBC.SimpleCamera(components);
  components.raycaster = new OBC.SimpleRaycaster(components);

  try {
    components.init();

    const grid = new OBC.SimpleGrid(components);
    components.scene.setup();
    const scene = components.scene.get();

    let fragmentIfcLoader = new OBC.FragmentIfcLoader(components);
    await fragmentIfcLoader.setup();
    fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = false;
    fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

    const file = await fetch(fileUrl);
    if (!file.ok) {
      throw new Error(`Erreur de chargement du fichier IFC : ${fileUrl}`);
    }
    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);
    const model = await fragmentIfcLoader.load(buffer, "example");
    scene.add(model);
  } catch (error) {
    console.error("Erreur lors du chargement de l'IFC :", error);
  }
}

document.querySelectorAll('.preview').forEach(async (preview) => {
  const fileUrl = `./model/${preview.getAttribute('data-ifc')}`;
  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '100%';
  preview.appendChild(container);

  await createPreview(container, fileUrl);

  preview.addEventListener('click', () => {
    window.location.href = `viewer.html?file=${preview.getAttribute('data-ifc')}`;
  });
});
