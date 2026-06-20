<template>
    <div class="h-dvh flex items-center justify-center bg-gray-50 px-4">
        <div 
            class="max-w-md w-full text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100 transition-transform duration-300"
            :class="{ 'shake-animation': showFeedback && !isApproved }"
        >
            <div class="flex justify-center mb-6">
                <div 
                    class="p-4 rounded-full transition-colors duration-500"
                    :class="isApproved ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500 animate-pulse'"
                >
                    <!-- Success Icon (Checkmark) -->
                    <svg v-if="isApproved" class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <!-- Pending Icon (Clock) -->
                    <svg v-else class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>

            <h2 class="text-2xl font-bold text-gray-800 mb-2">
                {{ isApproved ? 'Account Approved!' : 'Account Pending Approval' }}
            </h2>
            
            <p class="text-gray-600 mb-6">
                Thank you for signing up, <span class="font-semibold text-gray-700">{{ auth.pendingUserName }}</span>!
                <span v-if="!isApproved">Your elders need to verify your account before you can log in.</span>
                <span v-else>Your account is ready. Redirecting you to login...</span>
            </p>

            <div class="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200 text-sm text-gray-500">
                <p class="mb-1">Registered: <span class="font-medium text-gray-700">Just now</span></p>
                <p>Status: 
                    <span 
                        class="font-bold transition-colors"
                        :class="isApproved ? 'text-green-600' : 'text-amber-600'"
                    >
                        {{ isApproved ? 'Approved' : 'Awaiting Review' }}
                    </span>
                </p>
            </div>

            <div class="space-y-3">
                <button 
                    @click="checkApprovalStatus"
                    :disabled="auth.requesting || isApproved"
                    class="w-full relative overflow-hidden bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition duration-150 ease-in-out shadow-sm flex justify-center items-center gap-2"
                >
                    <span v-if="auth.requesting" class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                    <span>{{ auth.requesting ? 'Verifying...' : 'Check Status Now' }}</span>
                </button>

                <!-- Status Feedback Toast -->
                <p 
                    v-if="showFeedback && !isApproved" 
                    class="text-xs font-semibold text-amber-600 animate-bounce"
                >
                    Still pending review. Please check back later!
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import { usePageStore } from '@/stores/pages';

    const auth = useAuthStore()
    const pages = usePageStore()
    
    const isApproved = ref(false)
    const showFeedback = ref(false)

    const checkApprovalStatus = async () => {
        showFeedback.value = false
        
        const resp = await auth.checkPendingUserStatus()
        
        console.log(resp);

        if (resp === 'active') {
            isApproved.value = true
            // Small delay so the user sees the "Success" state before moving
            setTimeout(() => {
                pages.active = 'login'
            }, 1500)
        } else {
            // Trigger the "Still Pending" feedback
            showFeedback.value = true
            // Hide feedback after 3 seconds
            setTimeout(() => { showFeedback.value = false }, 3000)
        }
    }
</script>

<style scoped>
.shake-animation {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
    40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>