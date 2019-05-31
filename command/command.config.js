
/**
 * github:trsoliu trsoliu@gmail.com 2019-05-30
 * 配置文件 用于配置命令行文件
 * 
 */

module.exports = {
	config:{
		/**
		 * 打包的文件名称，不含版本号和日期号，此为解压部署包名称，
		 * 此项为空则启用vue.config.js中outputDir来配置，
		 * 若outputDir为空则启用package.json中name来配置
		 * */
		projectName: "vue-cli3-command",
		/**
		 * 配置上传到svn的参数
		 * */
		localPackage:{
			//是否启用保留版本到本地，慎重！！！，一旦关闭之前的版本压缩包都会被清除
			enable: true,
			dirName:"localPackageVersion"
		},
		//是否保留原打包文件夹、文件
		keepBuildDir:true,
		/**
		 * 需要先去在控制台做永久svn授权
		 * 预先设置上传ignore的文件 如：在svn全局config中配置global-ignores 添加 node_modules localPackage dist 等文件
		 * **/
		svn: {
			//是否启用上传svn
			enable: true,
			//部署版本包 上传 路径
			deploymentPackagePath: "https://XX@svn.XX.com:111/svn/XX/workspace/Tags/webTags/project-version/vue-cli3-command",
			//源码版本包 上传 路径
			sourceCodePackagePath: "https://XX@svn.XX.com:111/svn/XX/workspace/Tags/webTags/project-version-source/vue-cli3-command"
		},
		git: {
			//是否启用上传git
			enable: false,
			//部署版本包 上传 路径
			deploymentPackagePath: "",
			//源码版本包 上传 路径
			sourceCodePackagePath: ""
		},
		server: {
			//是否启用上传server
			enable: false,
			//部署版本包 上传 路径
			deploymentPackagePath: "",
//			sourceCodePackagePath: "",
			host: "112.110.10.100", // 服务器地址
			username: "root111", // 用户名
			password: "123131321"
		}
	}
}

