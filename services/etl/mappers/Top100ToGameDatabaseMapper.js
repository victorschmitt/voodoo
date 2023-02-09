module.exports = class StoreToGameDatabaseMapper {
  async map(data) {
    return data.reduce((acc, firstLevel) => {
      const mappedData = firstLevel.map((rawData) => ({
        publisherId: rawData.publisher_id,
        name: rawData.name,
        platform: rawData.os,
        storeId: rawData.id,
        bundleId: rawData.bundle_id,
        appVersion: rawData.version,
        // We assume TOP 100 app are published
        isPublished: true,
      }));

      return [...acc, ...mappedData];
    }, []);
  }
};
