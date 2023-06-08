let points  =[[0*0.5, 6*0.5], [2*0.5, 0*0.5], [8*0.5, 0*0.5],[2*0.5,-4*0.5],[6*0.5,-9*0.5],[0*0.5,-5*0.5],[6*0.5,-9*0.5],[0*0.5,-5*0.5],[-6*0.5,-9*0.5],[-2*0.5, -4*0.5],[-8*0.5,0*0.5],[-2*0.5,0*0.5],[0*0.5,6*0.5],];

// let points = [[-2, 0], [-1,-1], [0, -1],[1,0],[1,2],[0,3],[-1,3],[-2,2],[-3,2],[-4,1],[-4,-2],[-5,-4],[-4,-4],[-3,-2],[-2,-1],[-2,-3], [-2,-4], [-1, -4],[0,-4],[0,-2],[2,-2],[2,-4], [4, -4],[4,1],[3,2],[1,2],[1,2]]; //list資料
var fill_colors = "001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226".split("-").map(a=>"#"+a)
var line_colors = "064789-427aa1-ebf2fa-679436-a5be00".split("-").map(a=>"#"+a)
// +++++++++++++++++++++++++
var ball //"目前要處理的物件，暫時放在ball變數內"
var balls=[] //把產生的"所有"的物件，為物件的倉庫，所有物件資料都在此
// +++++++++++++++++++++++++++++++++++
var bullet = [] //"目前要處理的物件，暫時放在bullet變數內"
var bullets = [] //把產生的"所有"的物件，為物件的倉庫，所有物件資料都在此
// ++++++++++++++++++
var score = 0
function setup() {
  createCanvas(windowWidth, windowHeight);
  for(var i=0;i<50;i=i+1){//i=0,1,2,3,4,8,10
    ball = new Obj({}) //產生一個Obj class元件
    balls.push(ball) //把ball的物件放到balls陣列內
}
}
function draw() {
   background(220);
  // for(var j=0;j<balls.length;j=j+1){
  // ball=balls[j]
  // ball.draw()
  // ball.update()
  // }

  for(let ball of balls)
  {
    ball.draw()
    ball.update()
    for(let bullet of bullets){
    if(ball.isBallInRanger(bullet.p.x,bullet.p.y)){
     balls.splice(balls.indexOf(ball),1)
     bullets.splice(bullets.indexOf(bullet),1)
     score =score+1
  }
}
  }
  for(let bullet of bullets)
  {
    bullet.draw()
    bullet.update()
  }
    textSize(50)
    text(score,50,50) //在座標為(50,50)上，顯示Scroe分數
  push() //重新規劃原點(0,0)，在視窗中間
  let dx = mouseX - width/2
  let dy = mouseY - height/2
  let angle = atan2(dy,dx)
  translate(width/2,height/2)
  fill("#ff99c8")
  noStroke()
  rotate(angle)
  triangle(-25,-25,-25,25,50,0) //畫三個點，成一個三角形
  ellipse(0,0,50)
  pop() //恢復原本設定，原點(0,0)，在視窗左上角
}

function mousePressed(){
//   ball= new Obj({
// p:{x:mouseX,y:mouseY}
//   })
//   balls.push(ball)
bullet = new Bullet({
  r:15,
  color:"red"})
 //在滑鼠按下的地方，產生一個新的bullet class的原件
bullets.push(bullet) //把bullet放到倉庫



// for(let ball of balls){
//   if(ball.isBallInRanger(mouseX,mouseY)){
//     balls.splice(balls.indexOf(ball),1)
//     score =score+1
//   }
// }
}
class Obj{  //宣告一個類別,針對一個畫的圖案
    constructor(args){ //預設值,基本資料
      // this.p =args.p || {x: random(width) , y: random(height)}//描述該物件的初始位置
      this.p =args.p || createVector(random(width),random(height))
      // this.v ={x: random(-1,1) , y: random(-1,1)}//設定一個物件的移動速度
      this.v=createVector(random(-1,1),random(-1,1))
      this.size =random(10,30)//一個物件放大倍率
      this.color=random(fill_colors)//充滿顏色
      this.stroke=random(line_colors)//外框線條顏色
    }
    draw(){//劃出單一物件形狀
      push()//執行push()後,依照我的設定,設定原點(0,0)的位置
        translate(this.p.x,this.p.y)//以該物件為原點
        scale(this.v.x<0?1:-1,-1)//如果this.v.x<0條件成立,值為1,否則為-1
        fill(this.color)
        fill(this.stroke)
        strokeWeight(4)
      beginShape()
        for(var k=0; k < points.length;k=k+1){
          // line(points[k][0]*this.size,points[k][1]*this.size,points[k+1][0]*this.size,points[k+1][1]*this.size)
          curveVertex(points[k][0]*this.size,points[k][1]*this.size)
        }
        endShape()
        pop()//執行pop(),原點(0,0)設定回到整個視窗左上角
    }
    update(){//移動的程式碼內容
      // this.p.x=this.p.x+this.v.x
      // this.p.y=this.p.y+this.v.y
      this.p.add(this.v)//設定好向量後,使用add,就可以取代上面兩行
      //向量sub==>減號
  
      //知道滑鼠的位置,並建立一個滑鼠的向量
      let mouseV = createVector(mouseX,mouseY)//把滑鼠位置轉換成一個向量值
      let delta = mouseV.sub(this.p).limit(3)//sub計算出滑鼠所在位置向量(mouseV)到物件向量(this.p)
      this.p.add(delta)
  
      if(this.p.x<=0 || this.p.x>=width){
        this.v.x=-this.v.x
      }
      if(this.p.y<=0 || this.p.y>=height)
      this.v.y=-this.v.y
    }
    isBallInRanger(x,y){
      let d = dist(x,y,this.p.x,this.p.y)//計算兩點之間的距離
      if(d<4*this.size){
        return true
      }else{
        return false//滑鼠
      }
    }
  }
//定義一個bullet物件的class
class Bullet{
    constructor(args){//預設值,基本資料
        this.r = args.r || 10 //設計飛彈有大有小時，傳參數,a,args.r 設定飛彈大小，沒有傳參數，就以10為主
        this.p = args.p || createVector(width/2,height/2)   //建立一個向量，{x:width/2, y:height/2}   
        this.v = args.v || createVector(mouseX-width/2,mouseY-height/2).limit(5)  
        this.color = args.color || "#1982c4"
    }
   draw(){ //繪出物件
      push()
          translate(this.p.x,this.p.y)
          fill(this.color)
          noStroke()
         ellipse(0,0,this.r)
    pop() 
   } 
   update(){ //計算出移動後的位置
     this.p.add(this.v)
 
  }
}