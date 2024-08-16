using HarmonyLib;
using System;
using UnityEngine;

namespace ImmersiveLoadingScreens.Harmony
{
    [HarmonyPatch(typeof(XUiC_LoadingScreen), nameof(XUiC_LoadingScreen.Update))]
    public class CycleBackground
    {
        private const double CycleIntervalSeconds = 9;
        private const float FadeDurationSeconds = 1f;
        private static readonly ILogger Logger = new Logger();

        private static DateTime _lastChangeTime = DateTime.Now;
        private static int _currentBackgroundIndex = UnityEngine.Random.Range(0, XUiC_LoadingScreen.backgrounds.Count);
        private static int _currentTipIndex = UnityEngine.Random.Range(0, XUiC_LoadingScreen.tips.Count);
        private static bool _isFadingOut;
        private static float _fadeProgress;
        private static bool _firstRun = true;
        private static bool _showTips = true; 

        public static bool Prefix(XUiC_LoadingScreen __instance, float _dt)
        {
            var backgroundTextureView = __instance.backgroundTextureView;
            if (backgroundTextureView == null) return true;
            var timeSinceLastChange = (DateTime.Now - _lastChangeTime).TotalSeconds;
#if NO_LORE
            _showTips = false;
#endif

            if (_firstRun)
            {
                InitializeBackground(__instance);
                __instance.showTips = _showTips;
                if (_showTips) InitializeTip(__instance);
                _firstRun = false;
                _lastChangeTime = DateTime.Now;
                return true;
            }

            if (_isFadingOut)
            {
                HandleFadeOut(__instance, backgroundTextureView, _dt);
            }
            else if (timeSinceLastChange >= CycleIntervalSeconds - FadeDurationSeconds)
            {
                StartFadeOut(__instance);
            }
            else
            {
                HandleFadeIn(backgroundTextureView, _dt);
            }

            return true;
        }

        private static void InitializeBackground(XUiC_LoadingScreen instance)
        {
            instance.currentBackground = XUiC_LoadingScreen.backgrounds[_currentBackgroundIndex];
            instance.IsDirty = true;
        }

        private static void InitializeTip(XUiC_LoadingScreen instance)
        {
            instance.currentTipIndex = _currentTipIndex;
            instance.IsDirty = true;
        }

        private static void HandleFadeOut(XUiC_LoadingScreen instance, XUiV_Texture backgroundTextureView, float dt)
        {
            _fadeProgress += dt / FadeDurationSeconds;
            backgroundTextureView.Color = new Color(backgroundTextureView.Color.r,
                backgroundTextureView.Color.g,
                backgroundTextureView.Color.b,
                Mathf.Lerp(1f, 0f, _fadeProgress));

            if (!(_fadeProgress >= 1f)) return;

            UpdateBackground(instance);
            instance.showTips = _showTips;
            if (_showTips) UpdateTip(instance);
            _isFadingOut = false;
            _fadeProgress = 0;
            _lastChangeTime = DateTime.Now;
        }

        private static void StartFadeOut(XUiC_LoadingScreen instance)
        {
            _isFadingOut = true;
            _fadeProgress = 0;
        }

        private static void HandleFadeIn(XUiV_Texture backgroundTextureView, float dt)
        {
            _fadeProgress += dt / FadeDurationSeconds;
            backgroundTextureView.Color = new Color(backgroundTextureView.Color.r,
                backgroundTextureView.Color.g,
                backgroundTextureView.Color.b,
                Mathf.Lerp(0f, 1f, _fadeProgress));
        }

        private static void UpdateBackground(XUiC_LoadingScreen instance)
        {
            _currentBackgroundIndex = (_currentBackgroundIndex + 1) % XUiC_LoadingScreen.backgrounds.Count;
            instance.currentBackground = XUiC_LoadingScreen.backgrounds[_currentBackgroundIndex];
            instance.IsDirty = true;
        }

        private static void UpdateTip(XUiC_LoadingScreen instance)
        {
            _currentTipIndex = (_currentTipIndex + 1) % XUiC_LoadingScreen.tips.Count;
            instance.currentTipIndex = _currentTipIndex;
            Logger.Info($"Tip index changed to {_currentTipIndex}");
            instance.IsDirty = true;
        }
    }
}