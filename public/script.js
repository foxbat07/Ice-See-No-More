// Script.js
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 100000 );
var renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
const loader = new THREE.TextureLoader();
var perlin = new THREE.ImprovedNoise();
var strDownloadMime = "image/octet-stream";

// set time and clocks
var date = new Date();
var startMillis = date.getMilliseconds();
// var currentTime = date.getTime();
var clock = new THREE.Clock();
clock.start();

renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.gammaInput = true;
// renderer.gammaOutput = true;

document.body.appendChild( renderer.domElement );
var trackBallControls = new THREE.TrackballControls( camera, renderer.domElement );

var chromaScale =  chroma.scale([ '#F1B02E' , '#3BAAB6']).domain([0, 255]);
// var chromaScale =  chroma.scale(['#2FA4B5', '#2FA4B5', '#703A5E']).domain([0, 255]);
// var chromaScale =  chroma.scale(['#D1412C', '#F4774A']).domain([0, 255]);

// variables
var planeWidth = 800 * 20;
var planeHeight = 1600 * 20;
var planeWidthSegments = 799;  // -1 is very important
var planeHeightSegments = 1599;

// intialize lights
var sphere = new THREE.SphereBufferGeometry( 16, 16, 16 );
var pointLight = new THREE.PointLight( 0xa0a0a0, 1, 0 ,2 );
pointLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xdddddd, fog: false } ) ) );
scene.add( pointLight );
var ambientLight = new THREE.AmbientLight( controls.ambientLightColor, controls.ambientLightIntensity ); // soft white light
scene.add( ambientLight );

var distantFog = new THREE.FogExp2( controls.fogColor, controls.fogDensity/1000 );
var planeTerrainMaterial = new THREE.MeshPhongMaterial( {color: 0xffffff, vertexColors: THREE.VertexColors, shininess: 0, transparent: true, opacity: 0.9 });
var planeTerrainGeometry = new THREE.PlaneBufferGeometry(planeWidth, planeHeight, planeWidthSegments, planeHeightSegments);
planeTerrainGeometry.rotateX( - Math.PI / 2 );
var position = planeTerrainGeometry.attributes.position;
position.usage = THREE.DynamicDrawUsage;
var planeTerrainMesh = new THREE.Mesh( planeTerrainGeometry, planeTerrainMaterial );


var planeWireframeMaterial = new THREE.LineBasicMaterial( {color: 0xDEE2D6, transparent: true, opacity: 0.2  });
var planeWireframeMesh = new THREE.LineSegments( planeTerrainGeometry, planeWireframeMaterial );

planeWireframeMesh.translateY(10);
// start
init();
animate();

// threejs init function
function init(){
    camera.position.set(0,400,1200);
    trackBallControls.rotateSpeed = 4;
    trackBallControls.zoomSpeed = 1;
    scene.fog = distantFog;
    
    createGeometryFromMap();
    scene.add(planeTerrainMesh);
    scene.add(planeWireframeMesh);
}

// threejs animate function
function animate() {
    requestAnimationFrame(animate);
    trackBallControls.update();

    ambientLight.color.set(controls.ambientLightColor);
    ambientLight.intensity = controls.ambientLightIntensity;
    distantFog.color.set(controls.fogColor); // not using Hex on purpose
    distantFog.density = controls.fogDensity/10000;

    var time = Date.now() * 0.0005;
    pointLight.position.x = 60 - Math.sin( time * 0.7 ) * 120;
    pointLight.position.y = 60 - Math.cos( time * 0.5 ) * 120;
    pointLight.position.z = 200 - Math.cos( time * 0.3 ) * 400;

    planeTerrainMaterial.wireframe = controls.wireframe;

    render();
};

function render() {
    scene.background = new THREE.Color(controls.backgroundColor);
    renderer.render( scene, camera );
}

window.addEventListener( 'resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}, false );

function createGeometryFromMap() {
    var width = 800;
    var depth =  1600;

    var canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1600;
    var ctx = canvas.getContext('2d');

    var img = new Image();
    img.src = "./assets/combined.png";

    img.onload = function () {
        // draw on canvas
        ctx.drawImage(img, 0, 0);
        var pixel = ctx.getImageData(0, 0, width, depth);

        var meshData = [];
        for ( var i = 0 ; i < pixel.data.length; i+=4 ) {
            meshData.push(pixel.data[i] * 5);
        }
        var vertices = planeTerrainGeometry.attributes.position.array;
        for (var i = 1, j = 0 ; i < vertices.length; i+=3, j++) {
            vertices[i] = meshData[j];
        }

       
        planeTerrainGeometry.attributes.position.needsUpdate = true;
        planeTerrainGeometry.computeVertexNormals();
        planeTerrainGeometry.computeFaceNormals();
        
        planeTerrainMesh.name = 'Terrain';
        
        createTerrainColors();
    };
}


function createTerrainColors() {
    var count = planeTerrainGeometry.attributes.position.count;
    planeTerrainGeometry.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( count * 3 ), 3 ) );
    var color = new THREE.Color();
    var positions1 = planeTerrainGeometry.attributes.position;
    var colors1 = planeTerrainGeometry.attributes.color;

    for ( var i = 0; i < count; i ++ ) {
        color.set(chromaScale(positions1.getY( i )).hex());
        // color.setHSL( 0.55 , ( 1 - positions1.getY( i ) / 255 ) , 0.7 );
        colors1.setXYZ( i, color.r, color.g, color.b );
    }
    // console.log(chromaScale(100).hex());
    // console.log(color.set(chromaScale(100).hex()));
    planeTerrainGeometry.attributes.color.needsUpdate = true;
}