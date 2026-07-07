<script>
	import { redirect } from '@sveltejs/kit'

	throw redirect(303, `/#/${window.location.pathname}`)
</script>