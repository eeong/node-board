function onRemove(id){
	if(confirm('첨부파일을 삭제하시겠습니까?')) {
		$.get('/book/remove/'+id, function(r){
			if(r.code == 200){
				$(".file-wrap").remove();
			}
			else {
				alert("불가합니다 ");
			}
		});
	}
}