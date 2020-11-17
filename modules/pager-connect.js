const pager = (page, totalRecord, obj) => {
	page = Number(page);
	let {maxList = 5, maxPage = 5} = obj || {};
	let totalPage, pagerIdx, startIdx, startPage, endPage, nextPage, prevPage, nextPager, prevPager, firstPage, lastPage;
	totalPage = Math.ceil(totalRecord/maxList);
	lastPage = page < totalPage ? totalPage : 0;
	pagerIdx = Math.floor((page-1)/maxPage);
	startIdx = (page -1) * maxList;
	startPage = maxPage*pagerIdx+1;
	endPage = startPage + maxPage -1 > totalPage ? totalPage : startPage + maxPage -1;
	nextPage = page + 1 > totalPage ? 0 : page + 1;
	prevPage = page - 1;
	nextPager = endPage + 1 > totalPage ? 0 : endPage + 1;
	prevPager = startPage - 1;
	firstPage = 1;
	p = {page, totalRecord, maxList, maxPage, totalPage, pagerIdx, startIdx, startPage, endPage, nextPage, prevPage, nextPager, prevPager, firstPage, totalPage};
	return p;
}

module.exports = {pager};