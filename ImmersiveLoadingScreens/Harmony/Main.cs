namespace ImmersiveLoadingScreens.Harmony
{
    public class Main
    {
        private static readonly ILogger Logger = new Logger();

        public class Init : IModApi
        {
            public void InitMod(Mod modInstance)
            {
                const string id = "uk.co.rdok.7daystodie.mods.immersive_loading_screens";
                var harmony = new HarmonyLib.Harmony(id);
                harmony.PatchAll();
            }
        }
    }
}