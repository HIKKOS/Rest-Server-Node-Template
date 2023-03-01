const getImgIdsFromService = (Servicios = []) => {
    Servicios = Servicios.map((s) => {
        let Paths = s.ImgPaths;
        Paths = Paths.map((p) => {
            const [path] = Object.values(p);
            return path;
        });
        s.ImgPaths = Paths;
        return s;
    });
    return Servicios
}
module.exports = {
    getImgIdsFromService,
}