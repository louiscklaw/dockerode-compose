const expect = require('chai').expect,
  assert = require('assert');

var compose = require('./spec_helper').compose;
var compose_complex = require('./spec_helper').compose_complex;
var compose_whoami = require('./spec_helper').compose_whoami;
var compose_build = require('./spec_helper').compose_build;
var docker = require('./spec_helper').docker;

describe('hello_compose_whoami', function () {
  describe('#pull', function () {
    it("should pull all needed images with verbose", function (done) {
      this.timeout(600000);
      (async () => {
        await compose_whoami.pull(null, { 'verbose': true });
        done();
      })();
    });

    it("should pull all needed images silently", function (done) {
      this.timeout(600000);
      (async () => {
        await compose_whoami.pull();
        done();
      })();
    });

    it("should pull all needed images returning streams", function (done) {
      this.timeout(600000);
      (async () => {
        var streams = await compose_whoami.pull(null, { 'streams': true });
        expect(streams).to.be.ok;
        done();
      })();
    });
  })

  describe('#up', function () {
    it("should do compose up", function (done) {
      this.timeout(60000);
      (async () => {
        var report = await compose_whoami.up();
        expect(report.services).to.be.ok;
        done();
      })();
    });
    afterEach('clean up', function (done) {
      this.timeout(60000);
      (async () => {
        await compose_whoami.down({ volumes: true });
        done();
      })();
    });
  });

  describe('#down', function () {
    beforeEach('bring up', function (done) {
      this.timeout(20000);
      (async () => {
        await compose_whoami.up();
        done();
      })();
    });
    it("should do compose down", function (done) {
      this.timeout(60000);
      (async () => {
        await compose_whoami.down({volumes: true});
        let listContainers = await docker.listContainers({ 'all': true, 'filters': {"label":[`com.docker.compose.project=${compose_whoami.projectName}`]}});
        expect(listContainers).to.be.empty
        let listVolumes  = await docker.listVolumes({ 'filters': {"label":[`com.docker.compose.project=${compose_whoami.projectName}`]}})
        expect(listVolumes.Volumes).to.be.empty
        expect(listVolumes.Warnings).to.be.null
        let listNetworks = await docker.listNetworks({ 'filters': {"label":[`com.docker.compose.project=${compose_whoami.projectName}`]}})
        expect(listNetworks).to.be.empty
        done();
      })();
    });
  });
})