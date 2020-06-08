// gui initialize
var gui = new dat.GUI({load: JSON, preset: 'Default'});
gui.remember(controls);
// gui.useLocalStorage = true;

// set time and clocks
var date = new Date();
var currentTime = date.getTime();

var controls = new function() {
    this.takeImage = function(){ saveAsImage() };
    this.researchLink = function() {window.open('https://www.youtube.com/watch?v=EtI7f3Rwqkw')};
    this.backgroundColor = 0xA9061F;
    this.ambientLightColor = 0xA0A0A0;
    this.ambientLightIntensity = 1;
    this.fogDensity = 0;
    this.fogColor = 0xe691e6;

    this.form = 'Plane';
    this.rough = 4;
    this.octaves = 3;
    
    this.wireframe = false;
    this.formColor = 0xffffff;
    this.emissiveColor = 0x001625;
    this.metalness = 0.5;
    this.roughness = 0.5;
    this.flatShading = false;

    this.dynamic = false;
    this.amplitude = 0.5;
    this.frequency = 0.5;
    this.distortion = 20;
};

var general = gui.addFolder('Horizon Generator');
general.add(controls, 'takeImage').name('Take Screenshot');
general.addColor(controls, 'backgroundColor').name('Background');
general.add(controls, 'ambientLightIntensity', 0, 5).name('Ambient Intensity');
general.addColor(controls, 'ambientLightColor').name('Ambient Light');
general.add(controls, 'fogDensity', 0, 100).name('Fog Density');
general.addColor(controls, 'fogColor').name('Fog Color');

general.close();

var f0 = gui.addFolder('Form & Color');
f0.add(controls, 'form', [ 'Cylinder', 'Plane']);
f0.add(controls, 'rough', 0,20).name('Terrain Rough');
f0.add(controls, 'octaves', 0,5).name('Terrain Octaves').step(1);
f0.open();

var f1 = gui.addFolder('Material');
f1.add(controls, 'wireframe').name('Show Wireframe');
f1.add(controls, 'flatShading').name('Flat Shading');
f1.addColor(controls, 'formColor').name('Form Color');
f1.addColor(controls, 'emissiveColor').name('Emissive Color');
f1.add(controls, 'metalness', 0,1).name('Metalness');
f1.add(controls, 'roughness', 0,1).name('Roughness');
f1.open();

var f2 = gui.addFolder('Dynamic');
f2.add(controls, 'dynamic').name('Dynamic');
f2.add(controls, 'amplitude', 0, 1).name('Amplitude');
f2.add(controls, 'frequency', 0, 1).name('Frequency');
f2.add(controls, 'distortion', 1, 100).name('Distortion');

// Image saving
function saveAsImage() {
    var imgData;
    try {
        var strMime = "image/jpeg";
        var strDownloadMime = "image/octet-stream";
        imgData = renderer.domElement.toDataURL(strMime);
        var fileName = 'ice-image-' + currentTime+ '.jpg';
        saveFile(imgData.replace(strMime, strDownloadMime), fileName);
    } catch (e) {
        console.log(e);
        return;
    }
}

var saveFile = function (strData, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link); //Firefox requires the link to be in the body
        link.download = filename;
        link.href = strData;
        link.click();
        document.body.removeChild(link); //remove the link when done
    } else {
        location.replace(uri);
    }
}