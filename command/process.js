/**
 * github:trsoliu trsoliu@gmail.com 2019-05-30
 * 配置文件 用于配置命令行文件
 * 
 */

const {
	exec
} = require('child_process'); //调用shell命令模块
const {
	Client
} = require('ssh2'); //上传服务器模块
const compressing = require('compressing'); //压缩模块

const {
	config //命令配置的参数
} = require("./command.config.js");
const {
	outputDir //项目名称 ****查看vue.config.js中是否有此项
} = require("./../vue.config.js");
const {
	version, //项目版本
	name //项目名称
} = require('./../package.json');
const {
	timeStamp //版本时间戳，默认：年月日 时分秒，此精确到秒，如需调整可以更改timeStamp.js,如201905281607
} = require("./utils/timeStamp.js");

class Command {
	constructor() {
		//打包后输入的文件夹名称
		this.output = outputDir || "dist";
		/**
		 * 优先使用command.config.js中的config.projectName配置，次使用vue.config.js中的outputDir配置，最后使用package.json中的name配置
		 * */
		this.projectName = config.projectName || outputDir || name;
		//获取时间戳
		this.time_stamp = timeStamp();
		/**
		 * 默认打包部署文件夹命名规则:[项目名称]+"V"+[版本号]+"_"+[时间戳] ，如xxxV1.0.1_201905301512
		 */
		this.fileName = `${this.projectName}V${version}_${this.time_stamp}`;
	}

	//上传到svn
	uploadSVN() {
		let t = this;
		//需要先去在控制台做永久svn授权
		//上传运行的压缩包
		exec(`svn import -m "版本${t.fileName}" zipDir/ ${config.svn.deploymentPackagePath}`, (err, stdout, stderr) => {
			console.log(`版本${t.fileName}上传svn成功`)
			//清除多余版本文件
			exec(`rm -rf zipDir`, () => {
				//上传源码到svn，做版本源码tag
				exec(`svn import -m "版本${t.fileName}" ./  ${config.svn.sourceCodePackagePath}/${t.fileName}`, (err, stdout, stderr) => {
					console.log(`版本${t.fileName}源码上传svn成功`)
				})
			})
		})
	}
	//上传到git
	uploadGit() {}
	//上传到server
	uploadServer() {}

	// 压缩命令
	compress() {
		let t = this;
		exec(`mkdir zipDir`, function(err) {
			//此处第一个参数为要打包的目录, 第二个参数是打包后的文件名
			compressing.zip.compressDir(`${t.projectName}/`, `zipDir/${t.fileName}.zip`).then(() => {
				//console.log('*******压缩成功*******',config)
				//判断是否保留部署的压缩包版本到本地
				if(!!config.localPackage.enable) {
					exec(`mkdir ${config.localPackage.dirName}`, function(err) {
						exec(`cp -r zipDir/ ${config.localPackage.dirName}`, (err, stdout, stderr) => {})
					})
				} else {
					exec(`rm -rf ${config.localPackage.dirName}`, function(err1) {})
				}
				//删除用来做压缩包的文件夹
				exec(`rm -rf  ${t.projectName}`, function(err1) {});
				//上传到svn
				if(config.svn.enable) {
					t.uploadSVN()
				}
				//上传到git
				if(config.git.enable) {
					t.uploadGit()
				}
				//上传到服务器
				if(config.server.enable) {
					t.uploadServer()
				}
			})
		})

	}
	//触发执行命令
	init() {
		let t = this;
		if(!!config.keepBuildDir) {
			//将打包好的文件复制部署文件夹中，此为保留打包文件夹，若不想原打包文件夹可以使用上面文件
			exec(`cp -r ${t.output} ${t.projectName}`, (err, stdout, stderr) => {
				t.compress();
			})
		} else {
			//把打包后文件夹名称为${output}中的文件移动到${projectName}文件夹中，同时删除原${output}文件夹
			exec(`mv ${t.output} ${t.projectName}`, (err, stdout, stderr) => {
				t.compress();
			})
		}
	}
}

const command = new Command();
command.init();