<template>
    <div id="nav" class="navigation bg-gray-800 border-r-2 border-gray-700">
        <div class="nav-buttons">
            <div class="button">
                <UTooltip text="Home">
                    <UButton @click="openHome" icon="i-solar-home-2-linear" size="xl" color="gray"
                        square variant="ghost" />
                </UTooltip>
            </div>
            <div class="button">
                <UTooltip text="Chat">
                    <UButton @click="openYTChat" icon="i-solar-chat-round-video-linear" size="xl"
                        color="gray" square variant="ghost" />
                </UTooltip>
            </div>
        </div>
        <div class="user-actions">
            <div class="button">
                <UTooltip text="Dark Mode">
                    <UButton @click="toggleDarkMode" icon="i-solar-moon-linear" size="xl"
                        color="gray" square variant="ghost" />
                </UTooltip>
            </div>
            <div class="button">
                <UTooltip text="Sign In">
                    <UButton @click="openLogIn" icon="i-solar-login-3-linear" size="xl"
                        color="gray" square variant="ghost" />
                </UTooltip>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ipcRenderer } from 'electron';
const isChatOpen = ref(false);
const currentTab = ref('home');

// Handling dark/light mode switching
const colorMode = useColorMode()
const isDark = computed({
    get() {
        return colorMode.value === 'dark'
    },
    set() {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
})

const openYTChat = () => {
    isChatOpen.value = true;
    ipcRenderer.send('open-chat', isChatOpen.value);

    if (currentTab.value === 'login') {
        ipcRenderer.send('restore-url', isChatOpen.value);
    }

    currentTab.value = 'chat';
}

const openHome = () => {
    isChatOpen.value = false;
    ipcRenderer.send('close-chat', isChatOpen.value);

    if (currentTab.value === 'login') {
        ipcRenderer.send('restore-url', isChatOpen.value);
    }

    currentTab.value = 'home';
}

const openLogIn = () => {
    isChatOpen.value = true;
    ipcRenderer.send('toggle-login', 'https://www.youtube.com/account');
    ipcRenderer.send('open-chat', isChatOpen.value);

    currentTab.value = 'login';
}

const toggleDarkMode = () => {
    isDark.value = !isDark.value;
}

</script>

<style lang="scss" scoped>
#nav {
    height: 100%;
    width: 3rem;

    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 50% 50%;

    .nav-buttons {
        padding-top: 3rem;

        .button {
            margin-bottom: 0.5rem;
        }
    }

    .user-actions {
        justify-self: end;
        align-self: self-end;
        padding-bottom: 2rem;

        .button {
            margin-bottom: 0.5rem;
        }
    }
}
</style>
