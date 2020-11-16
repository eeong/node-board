-- INSERT INTO books SET title = '김치전', writer = '작자미상', content = '매콤할지도...?';
-- UPDATE books SET title = '부추전', writer = '작자미상', content = '달콤할지도...'  WHERE id=3;
-- DELETE FROM books WHERE title='김치전';
-- SELECT title, writer FROM books;
-- SELECT * FROM books ORDER BY id ASC;
-- SELECT * FROM books WHERE id=3;
-- SELECT * FROM books ORDER BY id ASC LIMIT 0, 3;
-- SELECT count(*) FROM books;

-- PAGER QUERY
-- SELECT * FROM books ORDER BY id DESC LIMIT (페이지index-1)*보여지는 테이블 갯수 , 보여지는 테이블 갯수


