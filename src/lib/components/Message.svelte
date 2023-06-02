<script lang="ts">
	export let message = {
		text: '',
		isUser: false
	};
</script>

<div class="flex items-end mb-2.5 {message.isUser ?  "right-msg" : "left-msg"}">
	<div class="msg-bubble">
		{message.text}
	</div>
</div>

<style lang="postcss">
	.left-msg .msg-bubble {
		@apply rounded-bl-none variant-ghost-surface;
	}
	.msg-bubble {
		@apply max-w-[450px] p-2.5 rounded-[15px];
		background: var(--left-msg-bg);
	}
	.right-msg {
		@apply flex-row-reverse;
	}
	.right-msg .msg-bubble {
		@apply rounded-br-none variant-ghost-tertiary;
	}
</style>
