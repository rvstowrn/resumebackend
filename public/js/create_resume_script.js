var skills = {};
var experience = {};
var links = {};
var tenth = {};
var twelth = {};
var college = {};
var image;

const ext = (s) => {
  return document.getElementById(s).value;
};

const addskill = () => {
  skills[ext("skill_name")] = ext("skill_desc");
  const skill_div = document.getElementById("skill_collection");
  
  skill_div.innerHTML += `
    <li class="collection-item" id=${ext("skill_name")}>
      <div>${ext("skill_name")}<br>${ext("skill_desc")}
        <a onclick='removeskill(${ext("skill_name")})' class="secondary-content">
          <i class="fa fa-trash"></i>
        </a>
      </div>
    </li>`;
};

const removeskill = (skill_name) => {
  console.log(skill_name);
  delete skills[skill_name];
  $("#"+skill_name).remove();
};


const addwork = () => {
  experience[ext("work_name")] = ext("work_desc");
  const work_div = document.getElementById("work_div");
  work_div.innerHTML += `<p><b>${ext("work_name")} </b></p> <p>${ext("work_desc")}</p>`;
};

const create_handler = async () => {

  links["github"] = ext("github");
  links["facebook"] = ext("facebook");
  links["linkedin"] = ext("linkedin");

  tenth['name']=ext("tenth_name");
  tenth['address']=ext("tenth_address");
  tenth['degree']=ext("tenth_degree");
  tenth['metric']=ext("tenth_metric");
  tenth['marks']=ext("tenth_marks");
  tenth['year']=ext("tenth_year");

  twelth['name']=ext("twelth_name");
  twelth['address']=ext("twelth_address");
  twelth['degree']=ext("twelth_degree");
  twelth['metric']=ext("twelth_metric");
  twelth['marks']=ext("twelth_marks");
  twelth['year']=ext("twelth_year");

  college['name']=ext("college_name");
  college['address']=ext("college_address");
  college['degree']=ext("college_degree");
  college['metric']=ext("college_metric");
  college['marks']=ext("college_marks");
  college['year']=ext("college_year");

  const about = ext('about');
  await Main();
  const json = {about,image,skills,experience,tenth,twelth,college,links};
  json['x-auth-token'] = str_obj(document.cookie).token; 

  $.post("/api/store_resume",json, function(res){
    if(res.msg=='success'){
        console.log(json);
        // window.location.href='./profile';
    }
    else{
        console.log(res);
    }

  });

};


function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
      if ((encoded.length % 4) > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = error => reject(error);
  });
}

async function Main() {
 const file = document.querySelector('#image').files[0];
 image = await getBase64(file);
 image = image.replace("data:image/png;base64,", "");
 image = image.replace("data:image/jpg;base64,", "");
 image = image.replace("data:image/jpeg;base64,", "");
}



function str_obj(str) {
    str = str.split('; ');
    var result = {};
    for (var i = 0; i < str.length; i++) {
        var cur = str[i].split('=');
        result[cur[0]] = cur[1];
    }
    return result;
}