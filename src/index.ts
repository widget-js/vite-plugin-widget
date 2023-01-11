import scanWidgetPackage from "./scanWidgetPackage";
import registerWidgetPackage from "./registerWidgetPackage";
import consola from "consola";

const ViteWidget = () => ({
    name: 'vite-plugin-widget',
    buildStart: async () => {
        const widgetPackage = scanWidgetPackage();
        consola.info("注册组件中：", new Date());
        await registerWidgetPackage(widgetPackage);
    },
    buildEnd: () => {
        console.log("buildEnd")
    },
    async handleHotUpdate() {
        const widgetPackage = scanWidgetPackage();
        consola.info("注册组件中：", new Date());
        await registerWidgetPackage(widgetPackage);
        return []
    }
})

export default ViteWidget;
