using HarmonyLib;

namespace ImmersiveLoadingScreens.Harmony
{
    [HarmonyPatch(typeof(XUiC_LoadingScreen), nameof(XUiC_LoadingScreen.cycle))]
    public class DisableTipsCycle
    {
        public static bool Prefix(int _increment)
        {
            return false;
        }
    }
}