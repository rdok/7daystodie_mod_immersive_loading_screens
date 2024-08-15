using HarmonyLib;
using System;

namespace ImmersiveLoadingScreens.Harmony
{
    [HarmonyPatch(typeof(XUiC_LoadingScreen), nameof(XUiC_LoadingScreen.Update))]
    public class CycleBackground
    {
        private const double CycleIntervalSeconds = 5;
        private static DateTime _lastChangeTime = DateTime.Now;
        private static int _currentBackgroundIndex;
        private static int _currentTipIndex;

        public static bool Prefix(XUiC_LoadingScreen __instance, float _dt)
        {
            if (!((DateTime.Now - _lastChangeTime).TotalSeconds >= CycleIntervalSeconds)) return true;

            _currentBackgroundIndex = (_currentBackgroundIndex + 1) % XUiC_LoadingScreen.backgrounds.Count;
            __instance.currentBackground = XUiC_LoadingScreen.backgrounds[_currentBackgroundIndex];

            _currentTipIndex = (_currentTipIndex + 1) % XUiC_LoadingScreen.tips.Count;
            __instance.currentTipIndex = _currentTipIndex;

            __instance.IsDirty = true;
            _lastChangeTime = DateTime.Now;

            return true;
        }
    }
}