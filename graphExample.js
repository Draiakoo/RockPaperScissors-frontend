import { useQuery, gql } from "@apollo/client"

export default function graphExample(creator) {
    const {loading, error, data} = useQuery(
      gql`
          {
            stateOfGames (where:{state:1, creator:"${creator}"}){
              gameId
              creator
              player2
              betAmount
              expirationDate
              state
              winner
            }
          }
        `

    )
    console.log(data)
    return <div></div>
}