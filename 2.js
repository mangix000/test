$(function(){
  function game_tcs(){
   this.$game_space=$(".game_space"),this.$tcs_body=$(".tcs_body"),this.$game_result=$(".game_result"),this.$game_start=$(".game_start"),this.score=0,this.$score_num=$(".score_space span"),this.t,this.arr_tli=[]
   }
  game_tcs.prototype={
  new_pos:function() {
	$(".tcs_food").remove();
	var i_left,i_top;
		i_left=Math.floor(Math.random()*this.$game_space.width()/8)*8; //随机初始化位置 left
		i_left>0?"":i_left=0;
		i_top=Math.floor(Math.random()*this.$game_space.height()/8)*8; //随机初始化位置 top
		i_top>0?"":i_top=0;
		tcs_w=8;
		tcs_h=8;
		
		var $tcs_li=this.$tcs_body.children(".tcs_li")
		li_num=$tcs_li.size();
        var while_break=false;
		while(1){
			i_left=Math.floor(Math.random()*this.$game_space.width()/8+1)*8-8; //随机初始化位置 left
		  	i_left>0?"":i_left=0;
			i_top=Math.floor(Math.random()*this.$game_space.height()/8+1)*8-8; //随机初始化位置 top
			i_top>0?"":i_top=0;
		  	for(var i=0;i<li_num;i++){
			  if(this.collide_test($tcs_li.eq(i).position().left,$tcs_li.eq(i).position().top,i_left,i_top))
				   break; 
			  if(i==li_num-1) {while_break=true}
			}
			if(while_break) {break;}
		}
		this.$game_space.append("<div style='top:"+i_top+"px;left:"+i_left+"px' class='tcs_food'></div>");  
  },
  tcs_anim:function(){
    var dir=parseInt(this.$tcs_body.attr("fx")),li_num=this.arr_tli.length,$tcs_li,last_left,last_top;
	last_left=this.arr_tli[li_num-1].css("left")
	last_top=this.arr_tli[li_num-1].css("top")
	 
	 var new_left=0,new_top=0; //定义偏移值
	 switch(dir) {
			case 3:new_left=-8;
			break;
			case 0:new_top=-8;
			break;
			case 1:new_left=8;
			break;
			case 2:new_top=8;
			break;
	}
	// 将最后一个位置放置第一个前面
	this.arr_tli[li_num-1].css({"left":this.arr_tli[0].position().left+new_left,"top":this.arr_tli[0].position().top+new_top});
	// 再将最后一个元素放置在数组的第一个的位置
	this.arr_tli.unshift(this.arr_tli.pop());
    //运动过程中判断贪吃蛇吃食物
   if(this.collide_test(this.arr_tli[0].position().left,this.arr_tli[0].position().top,$(".tcs_food").position().left,$(".tcs_food").position().top)) {
	 this.score+=10;
	 this.$score_num.text(this.score)
     this.$tcs_body.append("<div style='top:"+last_top+";left:"+last_left+"' class='tcs_li'></div>"); 
	 this.new_pos() ;
	 li_num++;
	 $tcs_li=this.$tcs_body.children(".tcs_li");
	 this.arr_tli.push($tcs_li.eq(li_num-1));
   }
   //超出边界 游戏结束
   if(this.arr_tli[0].position().left<0 || this.arr_tli[0].position().left>this.$game_space.width()-8 || this.arr_tli[0].position().top<0 || this.arr_tli[0].position().top>this.$game_space.height()-8){
	   
	 clearInterval(this.t);
     this.$game_result.show();
	 this.$tcs_body.children().remove();
   }
   for(var i=1;i<li_num;i++){
     if(this.collide_test(this.arr_tli[0].position().left,this.arr_tli[0].position().top,this.arr_tli[i].position().left,this.arr_tli[i].position().top)) {
	  clearInterval(this.t);
	  this.$game_result.show();
	  this.$tcs_body.children().remove();
	  break;
	 }
   }
  },
  game_start:function(){ 
  	  var _this=this
	  clearInterval(this.t);
	  this.arr_tli=[]
	  this.score=0;
	  this.$score_num.text(this.score)
	  this.$tcs_body.attr("fx",1)
	  for(var i=0;i<5;i++){
		  this.$tcs_body.append('<div class="tcs_li"></div>');
		  
	  }
	  var $tcs_li=$(".tcs_li")
	  for(var i=0;i<5;i++){
	   this.arr_tli.push($tcs_li.eq(i)); // 将jquery元素都存入数组内
	   this.arr_tli[i].css({"top":0,"left":8*(4-i)})
	  }
	  this.new_pos();
	  this.t=setInterval(function(){_this.tcs_anim()},120)

  },
  //碰撞测试
  collide_test:function(i_left,i_top,i2_left,i2_top){
   if(i_left==i2_left && i_top==i2_top)
    return 1;
   return 0;
  }
  }
  var game1=new game_tcs(); //新建游戏对象
  // 键盘点击事件 改变方向
  $(document).keydown(function(e){
	 var old_dir=parseInt(game1.$tcs_body.attr("fx"));
	 var new_dir=old_dir;
	 switch(e.keyCode) {
		 	case 37:new_dir=3;break;
			case 38:new_dir=0;break;
			case 39:new_dir=1;break;
			case 40:new_dir=2;break;
	 }
	 if(!(new_dir+2==old_dir || new_dir==old_dir+2))
	   game1.$tcs_body.attr("fx",new_dir)	
	})	
  game1.$game_start.click(function(){
	  game1.game_start();
	  $(this).hide();
  });
  game1.$game_result.click(function(){
	  game1.game_start();
	  $(this).hide();
  })
  
})
