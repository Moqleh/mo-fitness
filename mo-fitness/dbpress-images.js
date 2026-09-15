/* MO Fitness — dbpress stage images patch */
(function(){
  const apply=function(){
    const ex=(window.EXERCISES||window.exercises||[]).find?.(x=>x.id==='dbpress');
    if(!ex) return false;
    ex.images={
      start:'./assets/exercises/dbpress-start.jpg',
      movement:'./assets/exercises/dbpress-movement.jpg',
      finish:'./assets/exercises/dbpress-finish.jpg'
    };
    ex.stepImgs=[ex.images.start,ex.images.movement,ex.images.finish];
    return true;
  };
  if(!apply()) document.addEventListener('DOMContentLoaded',apply,{once:true});
})();
