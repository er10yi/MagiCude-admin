<template>
  <div style="background:#fff;padding:0 30px 0">
    <br>
    <div slot="tip" class="el-upload__tip">文件编码为utf-8, 除<b>selfd插件配置</b>能多文件上传外, 其他一次只能上传一个不超过3M的txt文件, 每行一条数据
      <br>任何一条数据包含 | 都不能批量导入（数据在后端以 | 分隔）
      <br>模板可在 GitHub页面【批量导入数据】下载</div>
    <hr>

    <el-row type="flex" class="row-bg el-row-two" justify="start">
      <el-col :span="24">
        <div style="padding:5px;">
          <el-form inline>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">项目组部门|项目组|联系人|邮箱|电话<br>测试部门|测试项目部|贰拾壹|test@test.com|1234567<br>测试部门|魔方项目部|名字|邮箱|暂无</div>
                <span>项目组部门项目组联系人</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="uploadDeptprocon"
                style="display:inline-block"
                :limit="1"
                action
                :http-request="uploadDeptprocon"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
              >
                <el-button slot="trigger" style="margin-left: 10px;" size="small" type="primary" plain>选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUploadDeptprocon">导入</el-button>
              </el-upload>
            </el-form-item>
          </el-form>

        </div>
      </el-col>
      <el-col :span="24">
        <div style="padding:5px;">
          <el-form inline>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">项目组|ip<br>项目组|ip段<br>项目组|ip cidr<br>魔方项目部|192.168.1.1<br>测试项目|192.168.1.1-192.168.2.11<br>测试项目|192.168.3.0/24</div>
                <span>项目组ip</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="uploadProjectinfoIp"
                style="display:inline-block"
                :limit="1"
                action
                :http-request="uploadProjectinfoIp"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
              >
                <el-button slot="trigger" style="margin-left: 10px;" size="small" type="primary" plain>选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUploadProjectinfoIp">导入</el-button>
              </el-upload>
            </el-form-item>
          </el-form>

        </div>
      </el-col>
    </el-row>

    <el-row type="flex" class="row-bg el-row-two" justify="start">
      <el-col :span="24">
        <div style="padding:5px;">
          <el-form inline>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">ip<br>ip段<br>ip cidr<br>ip[[端口,协议,状态,服务,版本],[端口,协议,状态,服务,版本]]<br>192.168.2.1<br>192.168.2.2-192.168.2.11<br>192.168.1.1[[1111,tcp,open,service22,version],[2222,udp,open,ssh,sshversion]]</div>
                <span>ip端口</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="uploadIpPort"
                style="display:inline-block"
                :limit="1"
                action
                :http-request="uploadIpPort"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
              >
                <el-button slot="trigger" style="margin-left: 10px;" size="small" type="primary" plain>选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUploadIpPort">导入</el-button>
              </el-upload>
            </el-form-item>
          </el-form>

        </div>
      </el-col>
      <el-col :span="24">
        <div style="padding:5px;">
          <el-form inline>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">ip:主机域名信息<br>192.168.1.1:work-testhostname.cor.com</div>
                <span>ip主机域名</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="uploadIpHostname"
                style="display:inline-block"
                :limit="1"
                action
                :http-request="uploadIpHostname"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
              >
                <el-button slot="trigger" style="margin-left: 10px;" size="small" type="primary" plain>选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUploadIpHostname">导入</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <hr>
    <span>导入顺序：漏洞分类 => 漏洞详情 => 插件配置/selfd插件配置 </span>

    <el-row type="flex" class="row-bg el-row-two" justify="start">
      <el-col :span="24">
        <div style="padding:5px;">

          <el-form inline>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">一级分类:二级分类1|二级分类2<br>有二级分类：越权:水平越权|垂直越权<br>无二级分类：拒绝服务:</div>
                <span>漏洞分类</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="uploadVulnCategory"
                style="display:inline-block"
                :limit="1"
                action
                :http-request="uploadVulnCategory"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
              >
                <el-button slot="trigger" style="margin-left: 10px;" size="small" type="primary" plain>选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUploadVulnCategory">导入</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="24">
        <div style="padding:5px;">

          <el-form inline>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">
                  名称|描述|风险级别|参考|影响范围|一级分类名称|二级分类名称|漏洞示例代码|漏洞POC|修复方案|修复代码示例|修复配置示例|暂无<br>
                  SSH弱密码|ssh弱密码，可直接远程登录服务器，导致服务器被攻陷|严重||所有SSH版本|失效的身份认证|弱密码|||1.修改ssh密码，使密码符合公司密码复杂度要求，2.配置防火墙，只对业务ip开放ssh访问权限|||暂无
                </div>
                <span>漏洞详情</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="uploadVulnDetail"
                style="display:inline-block"
                :limit="1"
                action
                :http-request="uploadVulnDetail"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
              >
                <el-button slot="trigger" style="margin-left: 10px;" size="small" type="primary" plain>选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUploadVulnDetail">导入</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <el-row type="flex" class="row-bg el-row-two" justify="start">
      <el-col :span="24">
        <div style="padding:5px;">
          <el-form inline>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">
                  风险: 信息, 低危, 中危, 高危, 严重, 致命<br>
                  对应多个服务，版本，关键字，需要多条配置，如果暂时没有漏洞，漏洞名称填默认<br>
                  辅助验证类型: http,dns<br>
                  名称|参数|风险|类型|辅助验证类型|超时|服务|版本|关键字|漏洞名称<br>
                  nse：<br>
                  smb-vuln-ms08-067||高危|nse|||microsoft-ds||VULNERABLE|默认<br>
                  smb-vuln-ms17-010||高危|nse|||microsoft-ds|Microsoft Windows Server 2008 R2 - 2012 microsoft-ds|VULNERABLE|默认<br>
                  自定义(不包含代码，代码需要在selfd插件配置中导入)：<br>
                  RedisWeakPass|info|高危|selfd||5000|redis|Redis key-value store|Server|Redis未授权访问<br>
                  RedisWeakPass|info|高危|selfd||5000|redis|Redis key-value store|Clients|Redis未授权访问<br>
                  RedisWeakPass|info|高危|selfd||5000|redis|Redis key-value store|Stats|Redis未授权访问
                </div>
                <span>插件配置</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="uploadPluginConfig"
                style="display:inline-block"
                :limit="1"
                action
                :http-request="uploadPluginConfig"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
              >
                <el-button slot="trigger" style="margin-left: 10px;" size="small" type="primary" plain>选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUploadPluginConfig">导入</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-col>

      <el-col :span="24">
        <div style="padding:5px;">
          <el-form inline>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">
                  风险: 信息, 低危, 中危, 高危, 严重, 致命<br>
                  对应多个服务，版本，关键字，需要多条配置，如果暂时没有漏洞，漏洞名称填默认<br>
                  插件规范：模块只能import或者from开头，否则未安装的模块不会自动安装<br>
                  辅助验证类型: http,dns<br>
                  名称|参数|风险|类型|辅助验证类型|超时|服务|版本|关键字|漏洞名称|<br>
                  插件代码<br>
                  自定义：<br>
                  RedisInfo|info|高危|selfd||5000|redis|Redis key-value store|Server|Redis未授权访问|
                  <pre>
# -*- coding:utf-8 -*-
import socket

def start(ip, port, cmd, timeout, payload_map):
    password_list = payload_map.get('password')

    try:
        socket.setdefaulttimeout(int(timeout))
        for password in password_list:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((ip, int(port)))
            s.send(('AUTH ' + password + '\r\n' + cmd + '\r\n').encode())
            byte_result = s.recv(1024)
            str_result = str(byte_result)
            if 'no password is set' in str_result:
                return 'RedisWeakPass\nRedis未设置密码' + byte_result.decode()
            if '+OK' in str_result:
                return 'RedisWeakPass\n密码：' + password + '\n' + byte_result.decode()
    except Exception:
        raise

                  </pre>

                  <br>
                </div>
                <span>selfd插件配置</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="uploadSelfdPluginConfig"
                style="display:inline-block"
                :limit="21"
                multiple
                :file-list="fileList"
                :on-exceed="handleExceed"
                :on-change="handleChange"
                :on-remove="handleRemove"
                action
                :auto-upload="false"
                :before-upload="beforeFileUpload"
              >
                <el-button slot="trigger" style="margin-left: 10px;" size="small" type="primary" plain>选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submituploadSelfdPluginConfig">导入</el-button>
                <div slot="tip" class="el-upload__tip">可批量上传, 单次最多上传30个文件, <b>总文件大小不能超过3M</b></div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <hr>

    <el-row type="flex" class="row-bg el-row-two" justify="start">
      <el-col :span="24">
        <div style="padding:5px;">
          <el-form inline>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">
                  ip|端口|检测白名单|提醒白名单<br>
                  指定端口：192.168.1.1|3389|1|0<br>
                  不指定端口（对ip设置白名单）：192.168.1.1||1|0
                </div>
                <span>ip端口白名单</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="uploadIpPortWhitelist"
                style="display:inline-block"
                :limit="1"
                action
                :http-request="uploadIpPortWhitelist"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
              >
                <el-button slot="trigger" style="margin-left: 10px;" size="small" type="primary" plain>选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUploadIpPortWhitelist">导入</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">
                  立即更新数据库ip端口白名单<br>
                </div>
                <el-button type="info" size="small" @click="updateIpPortWhitelist">立即更新</el-button>
              </el-tooltip>

            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="24">
        <div style="padding:5px;">
          <el-form inline>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">
                  对项目组下的ip和ip端口进行白名单<br>
                  项目名称|端口|检测白名单|提醒白名单<br>
                  指定端口：测试项目|3333|0|1<br>
                  不指定端口（对整个项目设置白名单）：测试项目||0|1
                </div>
                <span>项目组端口白名单</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="uploadProjectinfoPortWhitelist"
                style="display:inline-block"
                :limit="1"
                action
                :http-request="uploadProjectinfoPortWhitelist"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
              >
                <el-button slot="trigger" style="margin-left: 10px;" size="small" type="primary" plain>选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUploadProjectinfoPortWhitelist">导入</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">
                  立即更新数据库项目组端口白名单<br>
                  如果是ip白名单, 需要到联系信息管理-项目组, 开启覆盖ip白名单, 更新ip白名单才生效
                </div>
                <el-button type="info" size="small" @click="updateProjectinfoPortWhitelist">立即更新</el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>

        </div>
      </el-col>
    </el-row>

    <hr>

    <el-row type="flex" class="row-bg el-row-two" justify="start">
      <el-col :span="24">
        <div style="padding:5px;">

          <el-form inline>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">qq.com<br>www.baidu.com</div>
                <span>域名白名单</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="uploadDomainwhitelist"
                style="display:inline-block"
                :limit="1"
                action
                :http-request="uploadDomainwhitelist"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
              >
                <el-button slot="trigger" style="margin-left: 10px;" size="small" type="primary" plain>选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUploadDomainwhitelist">导入</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="24">
        <div style="padding:5px;">

          <el-form inline>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">Welcome to nginx<br>Apache Tomcat</div>
                <span>标题白名单</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="uploadTitlewhitelist"
                style="display:inline-block"
                :limit="1"
                action
                :http-request="uploadTitlewhitelist"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
              >
                <el-button slot="trigger" style="margin-left: 10px;" size="small" type="primary" plain>选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUploadTitlewhitelist">导入</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <el-row type="flex" class="row-bg el-row-two" justify="start">
      <el-col :span="24">
        <div style="padding:5px;">

          <el-form inline>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36 OPR/60.0.3255.84</div>
                <span>ua</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="uploadUa"
                style="display:inline-block"
                :limit="1"
                action
                :http-request="uploadUa"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
              >
                <el-button slot="trigger" style="margin-left: 10px;" size="small" type="primary" plain>选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUploadUa">导入</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="24">
        <div style="padding:5px;">
          <el-form inline>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">22<br>23<br>6379</div>
                <span>高危端口</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="uploadRiskport"
                style="display:inline-block"
                :limit="1"
                action
                :http-request="uploadRiskport"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
              >
                <el-button slot="trigger" style="margin-left: 10px;" size="small" type="primary" plain>选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUploadRiskport">导入</el-button>
              </el-upload>
            </el-form-item>
          </el-form>

        </div>
      </el-col>
    </el-row>

    <el-row type="flex" class="row-bg el-row-two" justify="start">
      <el-col :span="24">
        <div style="padding:5px;">

          <el-form inline>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">具体的服务<br>ssh<br>redis</div>
                <span>高危服务</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="uploadRiskservice"
                style="display:inline-block"
                :limit="1"
                action
                :http-request="uploadRiskservice"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
              >
                <el-button slot="trigger" style="margin-left: 10px;" size="small" type="primary" plain>选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUploadRiskservice">导入</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="24">
        <div style="padding:5px;">
          <el-form inline>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">具体的版本<br>Redis key-value store<br>Redis key-value store 5.0.8<br>Memcached</div>
                <span>高危版本</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="uploadRiskversion"
                style="display:inline-block"
                :limit="1"
                action
                :http-request="uploadRiskversion"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
              >
                <el-button slot="trigger" style="margin-left: 10px;" size="small" type="primary" plain>选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUploadRiskversion">导入</el-button>
              </el-upload>
            </el-form-item>
          </el-form>

        </div>
      </el-col>
    </el-row>

    <el-row type="flex" class="row-bg el-row-two" justify="start">
      <el-col :span="24">
        <div style="padding:5px;">
          <el-form inline>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">字典用户名<br>admin<br>root</div>
                <span>字典用户名</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="uploadDictUsername"
                style="display:inline-block"
                :limit="1"
                action
                :http-request="uploadDictUsername"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
              >
                <el-button slot="trigger" style="margin-left: 10px;" size="small" type="primary" plain>选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUploadDictUsername">导入</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="24">
        <div style="padding:5px;">
          <el-form inline>
            <el-form-item>
              <el-tooltip placement="top">
                <div slot="content">字典密码<br>admin<br>toor</div>
                <span>字典密码</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="uploadDictPassword"
                style="display:inline-block"
                :limit="1"
                action
                :http-request="uploadDictPassword"
                :auto-upload="false"
                :before-upload="beforeFileUpload"
              >
                <el-button slot="trigger" style="margin-left: 10px;" size="small" type="primary" plain>选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUploadDictPassword">导入</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

  </div>

</template>
<script>
import batchmanipulation from '@/api/batchmanipulation'

export default {
  data() {
    return {
      fileList: [],
      errFileList: []
    }
  },
  methods: {
    uploadDictUsername(param) {
      this.$confirm('上传后如果文件较大会导致页面超时, 但文件已在后台处理, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var form = new FormData()
        form.append('file', param.file)
        batchmanipulation.uploadDictUsername(form).then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },
    submitUploadDictUsername() {
      this.$refs.uploadDictUsername.submit()
    },
    uploadDictPassword(param) {
      this.$confirm('上传后如果文件较大会导致页面超时, 但文件已在后台处理, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var form = new FormData()
        form.append('file', param.file)
        batchmanipulation.uploadDictPassword(form).then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },
    submitUploadDictPassword() {
      this.$refs.uploadDictPassword.submit()
    },
    uploadProjectinfoIp(param) {
      this.$confirm('上传后如果文件较大会导致页面超时, 但文件已在后台处理, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var form = new FormData()
        form.append('file', param.file)
        batchmanipulation.uploadProjectinfoIp(form).then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },
    submitUploadProjectinfoIp() {
      this.$refs.uploadProjectinfoIp.submit()
    },
    uploadDeptprocon(param) {
      this.$confirm('上传后如果文件较大会导致页面超时, 但文件已在后台处理, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var form = new FormData()
        form.append('file', param.file)
        batchmanipulation.uploadDeptprocon(form).then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },
    submitUploadDeptprocon() {
      this.$refs.uploadDeptprocon.submit()
    },
    uploadRiskversion(param) {
      this.$confirm('上传后如果文件较大会导致页面超时, 但文件已在后台处理, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var form = new FormData()
        form.append('file', param.file)
        batchmanipulation.uploadRiskversion(form).then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },
    submitUploadRiskversion() {
      this.$refs.uploadRiskversion.submit()
    },
    uploadRiskservice(param) {
      this.$confirm('上传后如果文件较大会导致页面超时, 但文件已在后台处理, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var form = new FormData()
        form.append('file', param.file)
        batchmanipulation.uploadRiskservice(form).then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },
    submitUploadRiskservice() {
      this.$refs.uploadRiskservice.submit()
    },
    uploadRiskport(param) {
      this.$confirm('上传后如果文件较大会导致页面超时, 但文件已在后台处理, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var form = new FormData()
        form.append('file', param.file)
        batchmanipulation.uploadRiskport(form).then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },
    submitUploadRiskport() {
      this.$refs.uploadRiskport.submit()
    },
    uploadTitlewhitelist(param) {
      this.$confirm('上传后如果文件较大会导致页面超时, 但文件已在后台处理, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var form = new FormData()
        form.append('file', param.file)
        batchmanipulation.uploadTitlewhitelist(form).then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },
    submitUploadTitlewhitelist() {
      this.$refs.uploadTitlewhitelist.submit()
    },
    uploadDomainwhitelist(param) {
      this.$confirm('上传后如果文件较大会导致页面超时, 但文件已在后台处理, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var form = new FormData()
        form.append('file', param.file)
        batchmanipulation.uploadDomainwhitelist(form).then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },
    submitUploadDomainwhitelist() {
      this.$refs.uploadDomainwhitelist.submit()
    },
    uploadUa(param) {
      this.$confirm('上传后如果文件较大会导致页面超时, 但文件已在后台处理, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var form = new FormData()
        form.append('file', param.file)
        batchmanipulation.uploadUa(form).then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },
    submitUploadUa() {
      this.$refs.uploadUa.submit()
    },
    updateProjectinfoPortWhitelist() {
      this.$confirm('更新项目组端口白名单耗时较久, 且非常占CPU, 建议在无多任务情况下更新, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        batchmanipulation.batchUpdateProjectinfoAndPortWhitelist().then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },
    submitUploadProjectinfoPortWhitelist() {
      this.$refs.uploadProjectinfoPortWhitelist.submit()
    },
    uploadProjectinfoPortWhitelist(param) {
      this.$confirm('上传后如果文件较大会导致页面超时, 但文件已在后台处理, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var form = new FormData()
        form.append('file', param.file)
        batchmanipulation.uploadProjectinfoAndPortWhitelist(form).then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },

    updateIpPortWhitelist() {
      this.$confirm('立即更新ip端口白名单耗时较久, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        batchmanipulation.batchUpdateIpAndPortWhitelist().then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },
    submitUploadIpPortWhitelist() {
      this.$refs.uploadIpPortWhitelist.submit()
    },
    uploadIpPortWhitelist(param) {
      this.$confirm('上传后如果文件较大会导致页面超时, 但文件已在后台处理, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var form = new FormData()
        form.append('file', param.file)
        batchmanipulation.uploadIpAndPortWhitelist(form).then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },

    submitUploadVulnDetail() {
      this.$refs.uploadVulnDetail.submit()
    },
    uploadVulnDetail(param) {
      this.$confirm('上传后如果文件较大会导致页面超时, 但文件已在后台处理, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var form = new FormData()
        form.append('file', param.file)
        batchmanipulation.uploadVulnDetail(form).then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },

    submitUploadPluginConfig() {
      this.$refs.uploadPluginConfig.submit()
    },
    uploadPluginConfig(param) {
      this.$confirm('上传后如果文件较大会导致页面超时, 但文件已在后台处理, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var form = new FormData()
        form.append('file', param.file)
        batchmanipulation.uploadPluginConfig(form).then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },

    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 30 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },

    submituploadSelfdPluginConfig() {
      var txtMessage = ''
      var sizeMessage = ''
      const formData = new FormData()
      this.fileList.forEach(file => {
        const txtFile = file.raw.type === 'text/plain'
        const sizeLimit = file.size / 1024 / 1024 < 3
        if (!txtFile) {
          txtMessage = '文件只能是 txt 格式'
          this.errFileList.push(file.raw.name)
        }
        if (!sizeLimit) {
          sizeMessage = '文件大小不能超过 3M'
          this.errFileList.push(file.raw.name)
        }
        formData.append('file', file.raw)
      })
      if (this.errFileList.length !== 0) {
        this.$notify({
          message: this.errFileList + ' ' + txtMessage + ' ' + sizeMessage,
          type: 'error',
          duration: 5000
        })
        this.errFileList = []
      } else {
        batchmanipulation.uploadSelfdPluginConfig(formData).then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      }
    },

    submitUploadVulnCategory() {
      this.$refs.uploadVulnCategory.submit()
    },
    uploadVulnCategory(param) {
      this.$confirm('上传后如果文件较大会导致页面超时, 但文件已在后台处理, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var form = new FormData()
        form.append('file', param.file)
        batchmanipulation.uploadVulnCategory(form).then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },

    submitUploadIpHostname() {
      this.$refs.uploadIpHostname.submit()
    },
    uploadIpHostname(param) {
      this.$confirm('上传后如果文件较大会导致页面超时, 但文件已在后台处理, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var form = new FormData()
        form.append('file', param.file)
        batchmanipulation.uploadIpAndHostname(form).then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },

    submitUploadIpPort() {
      this.$refs.uploadIpPort.submit()
    },
    uploadIpPort(param) {
      this.$confirm('上传后如果文件较大会导致页面超时, 但文件已在后台处理, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        var form = new FormData()
        form.append('file', param.file)
        batchmanipulation.uploadIpAndPort(form).then(response => {
          this.$notify({
            message: response.message,
            type: (response.flag ? 'success' : 'error'),
            duration: 5000
          })
        })
      })
    },
    beforeFileUpload(file) {
      // 上传前格式与大小校验
      const txtFile = file.type === 'text/plain'
      const sizeLimit = file.size / 1024 / 1024 < 3
      if (!txtFile) {
        this.$message.error('文件只能是 txt 格式')
      }
      if (!sizeLimit) {
        this.$message.error('文件大小不能超过 3M')
      }
      return txtFile && sizeLimit
    }
  }
}
</script>
