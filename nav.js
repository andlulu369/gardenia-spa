document.addEventListener('DOMContentLoaded', function(){
  var btn = document.querySelector('.nav-toggle');
  var menu = document.querySelector('nav ul');
  if(btn && menu){
    btn.addEventListener('click', function(){
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ menu.classList.remove('open'); });
    });
  }
});
