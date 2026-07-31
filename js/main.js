// Keyboard focus mirrors hover on work-index rows, so tabbing gets the same bloom.
document.querySelectorAll('.row').forEach(function(row){
  row.addEventListener('focus', function(){ row.classList.add('focus-bloom'); });
  row.addEventListener('blur', function(){ row.classList.remove('focus-bloom'); });
});

// Smooth scroll for in-page nav links
document.querySelectorAll('a[href^="#"]').forEach(function(link){
  link.addEventListener('click', function(e){
    var target = document.querySelector(link.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});
