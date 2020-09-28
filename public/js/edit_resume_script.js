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

const init = () => {
  const skill_div = document.getElementById("skill_collection");
  const skill_children = skill_div.children;
  for (i = 0; i < skill_children.length; i++) {
    let child = skill_children[i];
    if(child.id != 'skill-header')
    skills[child.id] = child.getAttribute('data-value');
  }
  const work_div = document.getElementById("work_collection");
  const work_children = work_div.children;
  for (i = 0; i < work_children.length; i++) {
    let child = work_children[i];
    if(child.id != 'work-header')
    experience[child.id] = child.getAttribute('data-value');
  }
}

const addskill = () => {
  const skill_name = ext("skill_name");
  const skill_desc = ext("skill_desc");
  skills[skill_name] = skill_desc;
  const skill_div = document.getElementById("skill_collection");
  
  skill_div.innerHTML += `
    <li class="collection-item" id=${skill_name}>
      <div><b>${skill_name}</b><br>${skill_desc}</div>
      <div><i onclick='removeskill(${skill_name})'class="fa fa-trash"></i></div>
    </li>`;
};

const removeskill = (id) => {
  const target = document.getElementById(id);
  target.parentNode.removeChild(target);
  delete skills[target.id];
};


const addwork = () => {
  const work_name = ext("work_name");
  const work_desc = ext("work_desc");
  experience[work_name] = work_desc;
  const work_div = document.getElementById("work_collection");
  
  work_div.innerHTML += `
    <li class="collection-item" id=${work_name}>
      <div><b>${work_name}</b><br>${work_desc}</div>
      <div><i onclick='removework(${work_name})'class="fa fa-trash"></i></div>
    </li>`;
};

const removework = (id) => {
  const target = document.getElementById(id);
  target.parentNode.removeChild(target);
  delete experience[target.id];
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
  await removesuffix();
  const json = {about,image,skills,experience,tenth,twelth,college,links};
  json['x-auth-token'] = str_obj(document.cookie).token; 

  $.post("/api/edit_resume",json, function(res){
    if(res.msg=='success'){
      window.location.href='./profile';
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

async function removesuffix() {
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

init();