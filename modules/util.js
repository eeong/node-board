const alert = (msg,location) => {
	return `<script>	alert('${msg}'); location.href = '${location}';	</script>`;
}
module.exports = {alert};