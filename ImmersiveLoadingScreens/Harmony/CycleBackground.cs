using HarmonyLib;
using System;
using UnityEngine;

namespace ImmersiveLoadingScreens.Harmony
{
    [HarmonyPatch(typeof(XUiC_LoadingScreen), nameof(XUiC_LoadingScreen.Update))]
    public class CycleBackground
    {
        private const double CycleIntervalSeconds = 7;
        private const float FadeDurationSeconds = 1f;

        private static DateTime _lastChangeTime = DateTime.Now;
        private static int _currentBackgroundIndex;
        private static int _currentTipIndex;
        private static bool _isFadingOut;
        private static float _fadeProgress;

        public static bool Prefix(XUiC_LoadingScreen __instance, float _dt)
        {
            var backgroundTextureView = __instance.backgroundTextureView;
            if (backgroundTextureView == null) return true;

            var timeSinceLastChange = (DateTime.Now - _lastChangeTime).TotalSeconds;

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

        private static void HandleFadeOut(XUiC_LoadingScreen instance, XUiV_Texture backgroundTextureView, float _dt)
        {
            _fadeProgress += _dt / FadeDurationSeconds;
            backgroundTextureView.Color = new Color(backgroundTextureView.Color.r,
                backgroundTextureView.Color.g,
                backgroundTextureView.Color.b,
                Mathf.Lerp(1f, 0f, _fadeProgress));

            if (!(_fadeProgress >= 1f)) return;

            ChangeBackgroundAndTip(instance);
            _isFadingOut = false;
            _fadeProgress = 0;
            _lastChangeTime = DateTime.Now;
        }

        private static void StartFadeOut(XUiC_LoadingScreen instance)
        {
            _isFadingOut = true;
            _fadeProgress = 0;
            ChangeTip(instance);
        }

        private static void HandleFadeIn(XUiV_Texture backgroundTextureView, float dt)
        {
            _fadeProgress += dt / FadeDurationSeconds;
            backgroundTextureView.Color = new Color(backgroundTextureView.Color.r,
                backgroundTextureView.Color.g,
                backgroundTextureView.Color.b,
                Mathf.Lerp(0f, 1f, _fadeProgress));
        }

        private static void ChangeBackgroundAndTip(XUiC_LoadingScreen instance)
        {
            _currentBackgroundIndex = (_currentBackgroundIndex + 1) % XUiC_LoadingScreen.backgrounds.Count;
            instance.currentBackground = XUiC_LoadingScreen.backgrounds[_currentBackgroundIndex];

            _currentTipIndex = (_currentTipIndex + 1) % XUiC_LoadingScreen.tips.Count;
            instance.currentTipIndex = _currentTipIndex;

            instance.IsDirty = true;
        }

        private static void ChangeTip(XUiC_LoadingScreen instance)
        {
            _currentTipIndex = (_currentTipIndex + 1) % XUiC_LoadingScreen.tips.Count;
            instance.currentTipIndex = _currentTipIndex;
        }
    }
}