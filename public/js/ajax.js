
var entity_dict = new Map(); 
var response_dict = new Map(); 

var response_txt = readTextFile('txt/response.txt');
var entity_txt = readTextFile('txt/entity.txt');

var response = "";

for(i=0;i<entity_txt.length;i++)
{
    entity_dict.set(i+1, entity_txt[i].split(' ').filter(function(x){
		return (x !== (undefined || null || ''));
	}));
}

for(i=0;i<response_txt.length;i++)
{
    sp_arr = response_txt[i].split(',');
    key_arr = sp_arr[0].split(' ');
    for(j=0;j<key_arr.length;j++){
        if (!(key_arr[j] in response_dict) && key_arr[j]!='')
            response_dict.set(key_arr[j], sp_arr[1].trim());
    }
}

console.log(response_dict);
console.log(entity_dict);


$(document).ready(function(){

    $("#btn").click(function() {

        $.ajax({
            url: "/submit",
            type: "POST",         
            data: 
            {
                chat: $("#content").val(),
            }, 
            success: function(result)
            {   

                if(result.hasOwnProperty('movie')){
                    // $('#display_area').html(result['movie']);
                    response = result['movie'];
                    build_chat();
                }
                else if(result.hasOwnProperty('alarm'))
                {
                    // $('#display_area').html(result['alarm']);  
                    response = result['alarm'];
                    build_chat();

                }
                else if(result.hasOwnProperty('memo'))
                {
                    // $('#display_area').html(result['memo']); 
                    response = result['memo'];
                    build_chat();
                }
                else
                {
                   sentenceProcessing(result['sentence']);
        
                    // document.getElementById("send_response").innerHTML = $("#content").val();
                    $("#content").val('');
                    
                }                            
            },
            error: function() 
            {}
        });
    });
});

function build_chat(){
    dom = document.getElementById('chatroom');
    var row = document.createElement('div');
    row.className = "row";
    
    var cs9 = document.createElement('div'); 
    cs9.className = "col-sm-9";
    
    var mwt = document.createElement('div');
    mwt.className = "mwt_border";
    mwt.innerHTML = $("#content").val();
    
    var arrow_r_i = document.createElement('span');
    arrow_r_i.className = "arrow_r_int";
    
    var arrow_r_o = document.createElement('span');
    arrow_r_o.className = "arrow_r_out";
    
    var cs1 = document.createElement('div');    
    cs1.className = "col-sm-1";
    
    var im = document.createElement('img');
    im.src = "images/bear.png";
    im.width = "207";
    im.height = "195";

    mwt.appendChild(arrow_r_i);
    mwt.appendChild(arrow_r_o);
    cs1.appendChild(im);
    cs9.appendChild(mwt);

    row.appendChild(cs9);
    row.appendChild(cs1);

    dom.appendChild(row);



    var row = document.createElement('div');
    row.className = "row";
    
    var cs9 = document.createElement('div'); 
    cs9.className = "col-sm-3";
    
    var mwt = document.createElement('div');
    mwt.className = "egg_border";
    mwt.innerHTML = response;
    
    var arrow_r_i = document.createElement('span');
    arrow_r_i.className = "arrow_l_int";
    
    var arrow_r_o = document.createElement('span');
    arrow_r_o.className = "arrow_l_out";
    
    var cs1 = document.createElement('div');    
    cs1.className = "col-sm-10";
    
    var im = document.createElement('img');
    im.src = "images/robot.png";
    im.width = "232";
    im.height = "230";

    mwt.appendChild(arrow_r_i);
    mwt.appendChild(arrow_r_o);
    cs1.appendChild(im);
    cs9.appendChild(mwt);

    row.appendChild(cs9);
    row.appendChild(cs1);

    dom.appendChild(row);
};

function sentenceProcessing(sentence){

    var check = false;
    
        //console.log( sen_array[i]);
        // 找對應的entity array
        for (var k of entity_dict.keys()){  // num --> array[entity]
            //console.log( entity_dict.get(k));
            // 找array中對應的entity
            for(j=0;j<entity_dict.get(k).length;j++)
            {
                //斷詞結果有包含entity
                if (sentence.trim().includes(entity_dict.get(k)[j].trim()))
                {
                    //console.log(" sen_array[i] ==> ", i,"==>", sen_array[i]);
                    //console.log( "entity_dict.get(k)",entity_dict.get(k));
                    //console.log(response_dict.get(k.toString()));
                    check = true;
                    // $('#display_area').html(response_dict.get(k.toString()));
                    response = response_dict.get(k.toString());
                    build_chat();
                    // search youtube --->
                    if (k == 7)
                        $.ajax({
                            url: "/movie_request",
                            type: "POST",         
                            data: 
                            {
                                movie_request: true,
                            },
                        });

                    else if(k==3 || k==8){

                        $.ajax({
                            url: "/alarm_request",
                            type: "POST",      
                            data: 
                            {
                                alarm_request: true,
                            },
                            success:function(result){
                                console.log(result);
                                $('#test').attr('data-toggle', 'modal');
                                $('#test').attr('data-target', '#myModal');
                                $('#test').trigger('click');
                                $('#test').attr('data-toggle', '');
                            },
                            error: function(result){
                                alert('error');
                            }
                        });
                    }

                    else if(k==10){

                        $.ajax({
                            url: "/memo_request",
                            type: "POST",      
                            data: 
                            {
                                memo_request: true,
                            },
                            success:function(result){
                                console.log(result);
                                $('#test').attr('data-toggle', 'modal');
                                $('#test').attr('data-target', '#myModal_memo');
                                $('#test').trigger('click');
                                $('#test').attr('data-toggle', '');
                            },
                            error: function(result){
                                alert('error');
                            }
                        });
                    }
					
                    break;                   
                }             
            }
        }
    if (!check){
        // $('#display_area').html("對不起ㄟ我聽不懂！");
        response = "對不起ㄟ我聽不懂！";
        build_chat();
    }
}

function readTextFile(file)
{   
    var array =[];
    console.log(file);
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file,false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                array = allText.split("\n");
                //alert(allText);
            }
        }
    }
    rawFile.send(null);
    return  array;
}