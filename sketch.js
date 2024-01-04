panFromX=0;
panFromY=0;
panToX=0;
panToY=0;
imgX=0;
imgY=0;
var img;
var bldgcode;
var bldnames;
let calData;

//let markerX=
//let markerY=


function preload(){
img=loadImage("Campusmap1/Campus100dpi.png");
//campus_logo=loadImage("Campusmap1/download.jpg"); 
  
imgbld=loadImage("Campusmap1/Buildings100dpi.png");
bldtbl=loadTable('Campusmap1/Building_Codes.csv','csv','header');
sdsuimages=loadImage("SDSU_IMAGES/Viejas Arena.jpeg");
calData=loadJSON("/Event Calendar/calendar.json");
Eventloc=loadTable("Eventloc/Eventloc.csv",'csv','header');
     
}
function setup() {
  imgW_orig = img.width;
  imgH_orig =img.height;
  createCanvas(imgW_orig,imgH_orig);
  imgbldw=imgbld.width;
  imgbldh=imgbld.height;
  centerbldx=imgbldw/2;
  centerbldy=imgbldh/2;
  
  imgW=img.width;
  imgH=img.height;
  centerx=imgW/2;
  centery=imgH/2;
  
  //for overview map
  
  factor=0.3;
  ov_mapw=imgW_orig*0.3;
  ov_maph=imgH_orig*0.3;


  dateInput = createInput('', 'date'); 
  dateInput.position(10, 10); 
  let clickbutton=createButton("Search Event");
  clickbutton.position(20,40);
  loc = clickbutton.mousePressed(SearchEvent) ;
  var Event_summary;
 


}

function draw() {
  background(255);
  imageMode(CENTER)
  
 //Interpolation factor used for movement of overviewmap .......
var factor=0.3;
  
var w_ovmap=imgW_orig*factor;
var h_ovmap=imgH_orig*factor;

  //Initializing inset map same as ov map at beginning
var w_inset=imgW_orig*factor;
var h_inset=imgW_orig*factor;
//Left Corner  of overview map
var x_corner=imgW_orig - imgW_orig*factor;
var y_corner=0;
  
image(img, centerx, centery, imgW, imgH);
image(img, (imgW_orig - imgW_orig*factor)+(imgW_orig*factor)/2,(imgH_orig*factor)-(imgH_orig*factor)/2,w_ovmap, h_ovmap);

stroke(255);
strokeWeight(2);
noFill();
  
rect(imgW_orig - imgW_orig*factor,0,w_ovmap, h_ovmap);
  //tag();


drawingContext.shadowOffsetX = 5;
drawingContext.shadowOffsetY = -5;
drawingContext.shadowBlur = 10;
drawingContext.shadowColor = 'White';
let transparentBlue = color(0, 0, 255, 30);
fill(transparentBlue);

[w_inset,h_inset,x_corner, y_corner]=inset_map(w_ovmap,h_ovmap,imgW_orig,imgH_orig,imgW,imgH, centerx,centery,imgW_orig - imgW_orig*factor,0 );

rect(x_corner,y_corner,w_inset, h_inset);
 
  bldgName= mouseMoved();
  strokeWeight(4);
  textSize(16);
  textStyle(BOLD);
  fill(255,0,0);
  drawingContext.shadowOffsetX = 5;
  drawingContext.shadowOffsetY = -5;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'White';
  text(bldgName,mouseX,mouseY);
  //SearchEvent();
  // console.log(Event.summary)
  
  Build_Name=bldtbl.getColumn('Name');
  Codebld=bldtbl.getColumn('Pixel_Val');

     //console.log(Codebld);
    // loc = SearchEvent();
   // console.log(Build_Name);
   // console.log(loc);
  if (Build_Name.includes(loc)){
    //console.log('Location found in Building names:', loc);
   // console.log(Codebld);
    indx = Build_Name.indexOf(loc);
    //console.log('building idx', indx)
    const locval=Codebld[indx];
    //console.log(locval);
    const [markerX, markerY] = find_loc_coord(locval);
    //console.log(markerX);
    //console.log(markerY);
    strokeWeight(2);
    stroke(0);
    fill(0, 255, 0);
    rect(markerX, markerY, 15, 15);
   // strokeWeight(1);
    //fill(0,0,255)
    //text(Event_summary,markerX,markerY)
       // Set the text size
  textSize(16);
stroke(0);


  fill(0,0,255); // Black text color
  //textWrap(Event_summary);
  text(Event_summary, markerX,markerY);
    
  
  } 
}
function inset_map(w_ovmap,h_ovmap,imgW_orig,imgH_orig,imgW,imgH,centerx,centery, ov_corner_x, ov_corner_y){
  w_inset=(w_ovmap*imgW_orig)/imgW;
  h_inset=(h_ovmap*imgH_orig)/imgH;
  
  shrink_factor = w_ovmap/imgW;
  //Found the inset corner with respect to relation between overview map center and main image center 
  x_corner = ov_corner_x+w_ovmap*0.5 -centerx*shrink_factor;
  y_corner = ov_corner_y+h_ovmap*0.5 -centery*shrink_factor;
  return [w_inset,h_inset,x_corner, y_corner];
}
function find_loc_coord(build_code){
//Scan X-Axis and Y-Axis to get the building code
  for(mseX=0;mseX<imgW_orig;mseX++){
    for(mseY=0;mseY<imgH_orig;mseY++){
     const [pixelX, pixelY] = Imagesize(imgW_orig,imgH_orig,imgW,imgH,centerx,centery,mseX,mseY);
 //let  bldgcode= red(imgbld.get(pixelX,pixelY));
      let  bldgcode= red(imgbld.get(pixelX,pixelY));
     // console.log(bldgcode);
      if(build_code==bldgcode){
        //console.log(build_code);
        //console.log([mouseX, mouseY]);
        return [mseX,mseY];
      }
    }
  }
  
}



function SearchEvent(){
 let currentdate= dateInput.value();
   for (let key in calData){
     Event =calData[key];
     date=convertDate(Event.start);
    // console.log(date);
      if (currentdate == date ){
        console.log('sesrch ', Event.summary);
     loc=Locationmark(Event.summary,Eventloc);
        Event_summary=Event.summary;
        //console.log('locaiton ', loc);
        if (loc!= 'None'){break;}
        
        
     
      }
      /* else{ 
          /*console.log(currentdate);
          console.log(date);
          print("No Events ")}
         }*/
      
   }
  return loc;
 
}

 function convertDate(inputDate) {
  // Extract year, month, and day components from the input date
  
  let year = inputDate.substring(0, 4);
  let month = inputDate.substring(4, 6);
  let day = inputDate.substring(6, 8);

  // Format the components into "mm/dd/yyyy" format
  let formattedDate = year + '-' + month + '-' + day;
  return formattedDate;
}


function Locationmark(Event_Description_orig, Eventloc){
  var output_loc = 'None';
  //console.log(Event_Description_orig);
Event_Description = Event_Description_orig.split(' ');
 var output_loc;
let numRows=Eventloc.getRowCount();
  let EventName =Eventloc.getColumn('EventName');
  let Location=Eventloc.getColumn('Location');
 
  //console.log(numRows);
  for(let j=0 ;j< numRows ;j++){
    // console.log(EventName[j]);
    let Eventdescription=EventName[j].split(' ');
    
  const intersectingWords = Event_Description.filter(word => Eventdescription.includes(word));
    
   if(intersectingWords.length >= 2){
       output_loc = Location[j];
     // console.log(intersectingWords);
   }  
  }
   
 return output_loc;
}
  




function mouseMoved (){
  PanFromX=0;
  PanFromY=0;
 const[pixelX, pixelY] = Imagesize(imgW_orig,imgH_orig,imgW,imgH,centerx,centery,mouseX,mouseY);
  bldgcode=red(imgbld.get(pixelX,pixelY));
  // console.log(bldgcode);
  bldgName = getFeatureName(bldgcode,bldtbl);
 // console.log(bldgName);
 return bldgName;
  
}


function getFeatureName(bldgcode,bldtbl){
  let pixelval=bldtbl.getColumn('Pixel_Val');
  name_list=bldtbl.getColumn("Name");
   // print(bldgcode);
  for (var i=1;i<bldtbl.getRowCount();i++) {

  
    if(bldgcode == pixelval[i]){
    
      name=name_list[i];
      //console.log(name);
      return name;
    }
  }
}

function Imagesize(imgW_orig,imgH_orig,imgW,imgH,centerx,centery,mouseX,mouseY){
  xo=centerx-imgW/2;
  yo=centery-imgH/2;
  mouseXnew=mouseX-xo;
  mouseYnew=mouseY-yo;
  xo_new=0;
  yo_new=0;
  pixelX=int(imgW_orig/imgW*mouseXnew);
  pixelY=int(imgH_orig/imgH*mouseYnew);
  return [pixelX,pixelY];
}



//Panning and Zooming the image

function mousePressed(){
panFromX=mouseX;
panFromY=mouseY;
}
function mouseDragged(){
 panToX=mouseX;
 panToY=mouseY;
 xshift=panToX-panFromX;
 yshift=panToY-panFromY;
 centerx=centerx+xshift;
 centery=centery+yshift;
 panFromX=panToX;
 panFromY=panToY;
  
}
function mouseWheel(event){
scaleFactor=-0.001 * event.delta;
 imgW=int(imgW * (1+scaleFactor));
 imgH=int(imgH * (1+scaleFactor));
  centerx=mouseX+(1+scaleFactor)*(centerx-mouseX);
  centery=mouseY+(1+scaleFactor)*(centery-mouseY);
 // imgbldw=int(imgbldw * (1+scaleFactor));
 // imgbldh=int(imgbldh * (1+scaleFactor));


}
function keyPressed(){
 scaleFactor=-0.05;
if(key=='o'){
  imgW=int(imgW *(1+scaleFactor));
  imgH=int(imgH*(1+scaleFactor));
  centerx=mouseX+(1+scaleFactor)*(centerx-mouseX);
  centery=mouseY+(1+scaleFactor)*(centery-mouseY);
 
}
  if(key=='i'){
  imgW=int(imgW *(1-scaleFactor));
  imgH=int(imgH*(1-scaleFactor));
  centerx=mouseX+(1-scaleFactor)*(centerx-mouseX);
  centery=mouseY+(1-scaleFactor)*(centery-mouseY);
}
  
}


function windowResized() {
  resizeCanvas(imgW_orig,imgH_orig);
}


 